<?php

namespace App\Http\Controllers;

use App\Http\Requests\ThreadCreateRequest;
use App\Http\Requests\ThreadMarkAsReadRequest;
use App\Http\Requests\ThreadReplyRequest;
use App\Http\Requests\ThreadViewRequest;
use App\Http\Resources\ThreadResource;
use App\Mail\ThreadCreated;
use App\Mail\ThreadReplied;
use App\Models\Item;
use App\Models\Message;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ThreadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return ThreadResource::collection(
            Thread::with(['item.images', 'userGiver', 'userReceiver'])
                ->where(['user_id_giver' => $request->user()->id])
                ->orWhere(['user_id_receiver' => $request->user()->id])
                ->paginate(15),
        );
    }

    /**
     * Create a new thread.
     */
    public function create(ThreadCreateRequest $request)
    {
        $validated = $request->safe(['item', 'message']);
        $itemID = $validated['item'];
        $messageText = $validated['message'];

        $user = $request->user();
        Log::withContext([
            'itemID' => $itemID,
            'userID' => $user->id,
        ]);

        Log::debug('Thread: Create: Start');
        $item = Item::with(['user'])->find($itemID);
        $thread = new Thread();
        $thread->item()->associate($item);
        $thread->userGiver()->associate($item->user);
        $thread->userReceiver()->associate($user);
        $thread->save();

        $message = new Message(['message' => $messageText]);
        $message->user()->associate($user);
        $thread->messages()->save($message);

        Mail::to($item->user->email)->send(new ThreadCreated($item->user, $item));

        Log::debug('Thread: Create: Done', ['id' => $thread->id]);
        return new ThreadResource(
            Thread::with(['item.images', 'messages', 'userGiver', 'userReceiver'])
                ->find($thread->id),
        );
    }

    /**
     * Reply to a thread
     */
    public function reply(ThreadReplyRequest $request, Thread $thread)
    {
        $validated = $request->safe(['message']);
        $messageText = $validated['message'];

        $sender = $request->user();
        $receiver = $thread->userGiver->id === $sender->id
            ? User::find($thread->userReceiver->id)
            : User::find($thread->userGiver->id);

        $message = new Message(['message' => $messageText]);
        $message->user()->associate($sender);
        $thread->messages()->save($message);

        Mail::to($receiver->email)->send(new ThreadReplied($receiver, $sender, $thread->item));

        return new ThreadResource(
            Thread::with(['item.images', 'messages', 'userGiver', 'userReceiver'])
                ->find($thread->id),
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(ThreadViewRequest $request, Thread $thread)
    {
        return new ThreadResource(
            Thread::with(['item.images', 'messages', 'userGiver', 'userReceiver'])
                ->find($thread->id),
        );
    }

    /**
     * Mark the unread messages as read
     */
    public function markAsRead(ThreadMarkAsReadRequest $request, Thread $thread)
    {
        $user = $request->user();
        Log::debug('Thread: Mark Read', ['threadID' => $thread->id, 'userID' => $user->id]);
        $thread->messages()->whereNot('user_id', $user->id)->update(['is_read' => true]);
        return response()->noContent();
    }

    /**
     * Returns the amount of threads with unread messages
     */
    public function unreadThreadCount(Request $request)
    {
        $user = $request->user();
        $unreadThreadCount = Thread::distinct('threads.id')
            ->join('messages', 'threads.id', '=', 'messages.thread_id')
            ->where(function (Builder $query) use ($user) {
                $query
                    ->where('user_id_giver', $user->id)
                    ->orWhere('user_id_receiver', $user->id);
            })
            ->where('messages.user_id', '<>', $user->id)
            ->where('messages.is_read', false)
            ->count('threads.id');
        return response()->json(['unreadThreads' => $unreadThreadCount]);
    }
}
