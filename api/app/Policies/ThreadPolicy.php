<?php

namespace App\Policies;

use App\Models\Thread;
use App\Models\User;

class ThreadPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can reply to a thread
     */
    public function reply(User $user, Thread $thread): bool
    {
        return $thread->user_id_giver === $user->id
            || $thread->user_id_receiver === $user->id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Thread $thread): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Thread $thread): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Thread $thread): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Thread $thread): bool
    {
        return false;
    }
}
