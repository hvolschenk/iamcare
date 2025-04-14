<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can report the user.
     */
    public function report(User $reporter, User $reported): bool
    {
        return $reporter->id !== $reported->id;
    }
}
