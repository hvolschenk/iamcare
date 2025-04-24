<?php

namespace App\Policies;

use App\Models\Item;
use App\Models\User;

class ItemPolicy
{
    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Item $item): bool
    {
        return $user->id === $item->user->id;
    }

    /**
     * Determine whether the user can mark the model as given.
     */
    public function markGiven(User $user, Item $item): bool
    {
        return $user->id === $item->user->id;
    }

    /**
     * Determine whether the user can unmark the model as given.
     */
    public function unmarkGiven(User $user, Item $item): bool
    {
        return $user->id === $item->user->id;
    }

    /**
     * Determine whether the user can report the model.
     */
    public function report(User $user, Item $item): bool
    {
        return $user->id !== $item->user->id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Item $item): bool
    {
        return $user->id === $item->user->id;
    }
}
