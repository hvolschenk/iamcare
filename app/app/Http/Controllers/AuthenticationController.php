<?php

namespace App\Http\Controllers;

use App\Enums\AuthenticationProvider;
use App\Http\Requests\UserSetAuthenticationMethodDefaultRequest;
use App\Mail\AccountCreated;
use App\Models\AuthenticationMethod;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Laravel\Socialite\Contracts\User as SocialiteUser;
use Laravel\Socialite\Facades\Socialite;

class AuthenticationController extends Controller
{
    public function login()
    {
        return view('pages.login');
    }

    public function loginHandler(Request $request, AuthenticationProvider $driver)
    {
        Log::withContext(['driver' => $driver->value]);
        Log::debug('Login: Start');
        $socialUser = Socialite::driver($driver->value)->user();
        $avatar = self::getSocialUserAvatar($socialUser, $driver);

        $isAuthenticated = Auth::check();
        $authenticationMethodExists = AuthenticationMethod::where(['provider_id', $socialUser->getId()])
            ->exists();
        $userExists = User::where('email', $socialUser->getEmail())
            ->exists();

        if ($isAuthenticated) {
            if ($authenticationMethodExists) {
                return redirect()->route('myProfile', ['error' => 'userExists']);
            }
            $user = $request->user();
            $user->authenticationMethods()->create(
                [
                    'avatar' => $avatar,
                    'email' => $socialUser->getEmail(),
                    'is_primary' => false,
                    'name' => $socialUser->getName(),
                    'provider_id' => $socialUser->getId(),
                    'type' => $driver->value,
                ],
            );
            Log::info('Login: Add account to user', ['email' => $user->email, 'id' => $user->id]);

            return redirect()->route('myProfile');
        } else {
            DB::transaction(function () use ($avatar, $driver, $socialUser, $userExists) {
                if ($userExists) {
                    $user = User::where('email', $socialUser->getEmail())->first();
                } else {
                    $user = User::create([
                        'avatar' => $avatar,
                        'email' => $socialUser->getEmail(),
                        'name' => $socialUser->getName(),
                    ]);
                }

                $user->authenticationMethods()->updateOrCreate(
                    ['provider_id' => $socialUser->getId()],
                    [
                        'avatar' => $avatar,
                        'email' => $socialUser->getEmail(),
                        'is_primary' => count($user->authenticationMethods) === 0 ||
                            $user->authenticationMethods[0]->type === $driver->value,
                        'name' => $socialUser->getName(),
                        'type' => $driver->value,
                    ],
                );

                if (
                    count($user->authenticationMethods) > 0 &&
                    $user->authenticationMethods[0]->type === $driver->value
                ) {
                    Log::debug('Login: Update user');
                    $user->avatar = $avatar;
                    $user->email = $socialUser->getEmail();
                    $user->name = $socialUser->getName();
                    $user->save();
                }

                if (! $userExists) {
                    Mail::to($user->email)->send(new AccountCreated($user));
                }
            });

            /** @var \App\Models\User $user */
            $user = User::whereRelation('authenticationMethods', 'provider_id', $socialUser->getId())
                ->first();
            Auth::login($user, true);
            Log::info('Login: Success', ['email' => $user->email, 'id' => $user->id]);

            return redirect()->intended();
        }
    }

    public function loginRedirect(AuthenticationProvider $driver)
    {
        return Socialite::driver($driver->value)->redirect();
    }

    public function logout()
    {
        Auth::logout();

        return redirect()->route('home');
    }

    public function setAuthenticationMethodDefault(
        UserSetAuthenticationMethodDefaultRequest $request,
        AuthenticationMethod $authenticationMethod
    ) {
        $user = $request->user();
        DB::transaction(function () use ($authenticationMethod, $user) {
            $user->authenticationMethods()->update(['is_primary' => false]);

            $authenticationMethod->is_primary = true;
            $authenticationMethod->save();

            $user->avatar = $authenticationMethod->avatar;
            $user->email = $authenticationMethod->email;
            $user->name = $authenticationMethod->name;
            $user->save();
        });

        return response(null, 204, ['Hx-Redirect' => route('myProfile')]);
    }

    /**
     * Given a Socialite user, get the avatar.
     */
    private static function getSocialUserAvatar(
        SocialiteUser $user,
        AuthenticationProvider $driver,
    ): ?string {
        $avatar = $user->getAvatar();
        if (!$avatar) {
            return $avatar;
        }
        return $driver->value === AuthenticationProvider::Facebook->value
            ? "{$avatar}?access_token={$user->token}"
            : $avatar;
    }
}
