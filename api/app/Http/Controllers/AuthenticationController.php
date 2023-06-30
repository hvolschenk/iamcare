<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class AuthenticationController extends Controller
{
    public function currentUser(Request $request)
    {
        $user = $request->user();
        if ($user) {
            return new UserResource($user);
        }
        return response()->noContent();
    }

    public function loginWithProvider(Request $request, string $provider)
    {
        Log::withContext(['method' => $provider]);
        $accessToken = $request->input('accessToken');
        /** @var \Laravel\Socialite\Two\AbstractProvider $socialiteProvider */
        $socialiteProvider = Socialite::driver($provider);

        try {
            $providerUser = $socialiteProvider->userFromToken($accessToken);
            Log::debug('Login: Start', ['email' => $providerUser->getEmail()]);

            DB::transaction(function () use ($provider, $providerUser) {
                $user = User::firstOrCreate(
                    ['email' => $providerUser->getEmail()],
                    [
                        'avatar' => $providerUser->getAvatar(),
                        'name' => $providerUser->getName(),
                    ],
                );

                $user->authenticationMethods()->where('is_primary', true)->get();

                $user->authenticationMethods()->updateOrCreate(
                    ['email' => $providerUser->getEmail(), 'type' => $provider],
                    [
                        'provider_id' => $providerUser->getId(),
                        'name' => $providerUser->getName(),
                        'avatar' => $providerUser->getAvatar(),
                        'is_primary' =>
                            count($user->authenticationMethods) === 0 ||
                            $user->authenticationMethods[0]->type === $provider,
                    ],
                );

                if (
                    count($user->authenticationMethods) > 0 &&
                    $user->authenticationMethods[0]->type === $provider
                ) {
                    Log::debug('Login: Update user');
                    $user->avatar = $providerUser->getAvatar();
                    $user->name = $providerUser->getName();
                    $user->save();
                }
            });

            /** @var \App\Models\User $user */
            $user = User::where('email', $providerUser->getEmail())->first();
            Auth::login($user);
            $request->session()->regenerate();
            Log::info('Login: Success', ['email' => $user->email, 'id' => $user->id]);
            return new UserResource($user);
        } catch (\Exception $error) {
            Log::error('Login: Failure', ['message' => $error->getMessage()]);
            return response(null, 500);
        }
    }
}
