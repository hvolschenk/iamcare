<?php

namespace App\Http\Controllers;

use App\Mail\AccountCreated;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Laravel\Socialite\Facades\Socialite;

class AuthenticationController extends Controller
{
    public function googleHandler()
    {
        Log::withContext(['driver' => 'google']);
        try {
            Log::debug('Login: Start');
            $socialUser = Socialite::driver('google')->user();

            DB::transaction(function () use ($socialUser) {
                $userExists = User::where('email', $socialUser->getEmail())->exists();
                $user = User::firstOrCreate(
                    ['email' => $socialUser->getEmail()],
                    [
                        'avatar' => $socialUser->getAvatar(),
                        'name' => $socialUser->getName(),
                    ],
                );

                $user->authenticationMethods()->where('is_primary', true)->get();

                $user->authenticationMethods()->updateOrCreate(
                    ['email' => $socialUser->getEmail(), 'type' => 'google'],
                    [
                        'provider_id' => $socialUser->getId(),
                        'name' => $socialUser->getName(),
                        'avatar' => $socialUser->getAvatar(),
                        'is_primary' =>
                        count($user->authenticationMethods) === 0 ||
                            $user->authenticationMethods[0]->type === 'google',
                    ],
                );

                if (
                    count($user->authenticationMethods) > 0 &&
                    $user->authenticationMethods[0]->type === 'google'
                ) {
                    Log::debug('Login: Update user');
                    $user->avatar = $socialUser->getAvatar();
                    $user->name = $socialUser->getName();
                    $user->save();
                }

                if (!$userExists) {
                    Mail::to($user->email)->send(new AccountCreated($user));
                }
            });

            /** @var \App\Models\User $user */
            $user = User::where('email', $socialUser->getEmail())->first();
            Auth::login($user, true);
            Log::info('Login: Success', ['email' => $user->email, 'id' => $user->id]);
            return redirect()->intended();
        } catch (\Exception $error) {
            Log::error('Login: Failure', ['message' => $error->getMessage()]);
            return response()
                ->view('pages.login', ['error' => __('login.error--generic')])
                ->setStatusCode(400);
        }
    }

    public function googleRedirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function login()
    {
        return view('pages.login');
    }

    public function logout()
    {
        Auth::logout();
        return redirect()->route('home');
    }
}
