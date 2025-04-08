<?php

namespace App\Policies;

use App\Models\Item;
use App\Models\Thread;
use App\Models\User;

class ThreadPolicy
{
    /**
     * Determine whether the user can create a thread
     */
    public function create(User $user, Item $item): bool
    {
        if ($item->user->id === $user->id) {
            return false;
        }

        $thread = Thread::where([
            'item_id' => $item->id,
            'user_id_receiver' => $user->id,
        ])->first();
        if ($thread !== null) {
            return false;
        }

        return true;
    }

    /**
     * Determine whether the user can reply to the thread.
     */
    public function reply(User $user, Thread $thread): bool
    {
        return $thread->userGiver->id === $user->id
            || $thread->userReceiver->id === $user->id;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Thread $thread): bool
    {
        return $thread->userGiver->id === $user->id
            || $thread->userReceiver->id === $user->id;
    }
}
