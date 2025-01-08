<?php

namespace App\Http\Controllers;

use App\Http\Requests\ThreadCreateHandlerRequest;
use App\Http\Requests\ThreadCreateRequest;
use App\Http\Requests\ThreadReplyRequest;
use App\Http\Requests\ThreadViewRequest;
use App\Mail\ThreadCreated;
use App\Mail\ThreadReplied;
use App\Models\Item;
use App\Models\Message;
use App\Models\Thread;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ThreadController extends Controller
{
    public function create(ThreadCreateRequest $request, Item $item)
    {
        if ($request->user()->id === $item->user->id) {
            return redirect()->route('item', $item);
        }

        $thread = Thread::where([
            'item_id' => $item->id,
            'user_id_receiver' => $request->user()->id,
        ])->first();
        if ($thread !== null) {
            return redirect()->route('thread', $thread);
        }

        return view('pages.thread-create', ['item' => $item]);
    }

    public function createForm(Item $item)
    {
        return view(
            'components.thread-form',
            [
                'actionPrimaryLabel' => __('thread.actionSend'),
                'actionPrimaryLocation' => route('threadCreateHandler', $item),
                'item' => $item,
            ],
        );
    }

    public function createHandler(ThreadCreateHandlerRequest $request, Item $item)
    {
        $validated = $request->safe(['message']);
        $messageText = $validated['message'];

        $user = $request->user();
        Log::withContext([
            'itemID' => $item->id,
            'userID' => $user->id,
        ]);

        Log::debug('Thread: Create: Start');
        $thread = new Thread;
        $thread->item()->associate($item);
        $thread->userGiver()->associate($item->user);
        $thread->userReceiver()->associate($user);
        $thread->save();

        $message = new Message(['message' => $messageText]);
        $message->user()->associate($user);
        $thread->messages()->save($message);

        Mail::to($item->user->email)->send(new ThreadCreated($item->user, $item));

        Log::debug('Thread: Create: Done', ['id' => $thread->id]);

        return response(null, 204, ['Hx-Redirect' => route('thread', $thread)]);
    }

    public function index()
    {
        $threads = Thread::latest('updated_at')->paginate(12);

        return view('pages.threads', ['threads' => $threads]);
    }

    public function reply(ThreadReplyRequest $request, Thread $thread)
    {
        $validated = $request->safe(['message']);
        $messageText = $validated['message'];

        $sender = $request->user();
        $receiver = $thread->userGiver->id === $sender->id
            ? $thread->userReceiver
            : $thread->userGiver;

        $message = new Message(['message' => $messageText]);
        $message->user()->associate($sender);
        $thread->messages()->save($message);

        Mail::to($receiver->email)->send(new ThreadReplied($receiver, $sender, $thread->item));

        return view('pages.thread.messages', ['thread' => $thread]);
    }

    public function replyForm(Thread $thread)
    {
        return view('pages.thread.messages', ['thread' => $thread]);
    }

    public function view(ThreadViewRequest $request, Thread $thread)
    {
        $user = $request->user();
        Log::debug('Thread: Mark Read', ['threadID' => $thread->id, 'userID' => $user->id]);
        $thread->messages()->whereNot('user_id', $user->id)->update(['is_read' => true]);

        return view('pages.thread.thread', ['thread' => $thread]);
    }
}
