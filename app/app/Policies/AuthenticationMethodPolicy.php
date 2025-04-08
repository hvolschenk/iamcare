<?php

namespace App\Policies;

use App\Models\AuthenticationMethod;
use App\Models\User;

class AuthenticationMethodPolicy
{
    /**
     * Determine whether the user can report the user.
     */
    public function setDefault(User $user, AuthenticationMethod $authenticationMethod): bool
    {
        return $user->authenticationMethods->contains($authenticationMethod);
    }
}
