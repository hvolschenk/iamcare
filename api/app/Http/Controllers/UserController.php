<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserLoginRequest;
use App\Http\Resources\ItemResource;
use App\Http\Resources\UserResource;
use App\Mail\AccountCreated;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Laravel\Socialite\Facades\Socialite;

class UserController extends Controller
{
    public function show(User $user)
    {
        return new UserResource($user);
    }

    public function currentUser(Request $request)
    {
        $user = $request->user();
        if ($user) {
            return new UserResource($user);
        }
        return response()->noContent();
    }

    public function items(Request $request, User $user)
    {
        return ItemResource::collection(
            $user
                ->items()
                ->latest()
                ->paginate(intval($request->query('perPage', 15))),
        );
    }

    public function loginWithProvider(UserLoginRequest $request, string $provider)
    {
        Log::withContext(['method' => $provider]);

        $validated = $request->safe(['accessToken']);
        $accessToken = $validated['accessToken'];

        /** @var \Laravel\Socialite\Two\AbstractProvider $socialiteProvider */
        $socialiteProvider = Socialite::driver($provider);

        try {
            $providerUser = $socialiteProvider->userFromToken($accessToken);
            Log::debug('Login: Start', ['email' => $providerUser->getEmail()]);

            DB::transaction(function () use ($provider, $providerUser) {
                $userExists = User::where('email', $providerUser->getEmail())->exists();
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

                if (!$userExists) {
                    Mail::to($user->email)->send(new AccountCreated($user));
                }
            });

            /** @var \App\Models\User $user */
            $user = User::where('email', $providerUser->getEmail())->first();
            Auth::login($user, true);
            $request->session()->regenerate();
            Log::info('Login: Success', ['email' => $user->email, 'id' => $user->id]);
            return new UserResource($user);
        } catch (\Exception $error) {
            Log::error('Login: Failure', ['message' => $error->getMessage()]);
            return response(null, 500);
        }
    }
}
