<?php

namespace App\Http\Controllers;

use App\Http\Resources\ThreadResource;
use App\Models\Item;
use App\Models\Message;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ThreadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Thread::class);
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
    public function create(Request $request)
    {
        $this->authorize('create', Thread::class);
        $request->validate([
            'item' => 'bail|required',
            'message' => 'bail|required',
        ]);
        $itemID = $request->input('item');
        $messageText = $request->input('message');
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

        Log::debug('Thread: Create: Done', ['id' => $thread->id]);
        return new ThreadResource(
            Thread::with(['item.images', 'messages', 'userGiver', 'userReceiver'])
                ->find($thread->id),
        );
    }

    /**
     * Reply to a thread
     */
    public function reply(Request $request, Thread $thread)
    {
        $this->authorize('reply', $thread);
        $request->validate([
            'message' => 'bail|required',
        ]);

        $user = $request->user();
        $messageText = $request->input('message');

        $message = new Message(['message' => $messageText]);
        $message->user()->associate($user);
        $thread->messages()->save($message);

        return new ThreadResource(
            Thread::with(['item.images', 'messages', 'userGiver', 'userReceiver'])
                ->find($thread->id),
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Thread $thread)
    {
        $this->authorize('view', $thread);
        return new ThreadResource(
            Thread::with(['item.images', 'messages', 'userGiver', 'userReceiver'])
                ->find($thread->id),
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Thread $thread)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Thread $thread)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Thread $thread)
    {
        //
    }
}
