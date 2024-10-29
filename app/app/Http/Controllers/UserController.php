<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserItemsRequest;
use App\Http\Requests\UserLoginHandlerGoogleRequest;
use App\Http\Requests\UserMeRequest;
use App\Mail\AccountCreated;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    /**
     * The login page (POST)
     */
    public function loginHandlerGoogle(UserLoginHandlerGoogleRequest $request)
    {
        Log::withContext(['method' => 'google']);

        $csrfTokenCookie = $request->cookie('g_csrf_token');

        $validated = $request->safe(['credential', 'g_csrf_token']);
        $csrfToken = $validated['g_csrf_token'];

        if (!$csrfToken || !$csrfTokenCookie || $csrfToken !== $csrfTokenCookie) {
            return response()
                ->view('pages.login', ['error' => __('login.error--generic')])
                ->setStatusCode(400);
        }

        $credential = $validated['credential'];
        $client = new \Google\Client([
            'client_id' => config('google.identity.client_id'),
        ]);

        try {
            $tokenData = $client->verifyIdToken($credential);

            DB::transaction(function () use ($tokenData) {
                $userExists = User::where('email', $tokenData['email'])->exists();
                $user = User::firstOrCreate(
                    ['email' => $tokenData['email']],
                    [
                        'avatar' => $tokenData['picture'],
                        'name' => $tokenData['name'],
                    ],
                );

                $user->authenticationMethods()->where('is_primary', true)->get();

                $user->authenticationMethods()->updateOrCreate(
                    ['email' => $tokenData['email'], 'type' => 'google'],
                    [
                        'provider_id' => $tokenData['sub'],
                        'name' => $tokenData['name'],
                        'avatar' => $tokenData['picture'],
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
                    $user->avatar = $tokenData['picture'];
                    $user->name = $tokenData['name'];
                    $user->save();
                }

                if (!$userExists) {
                    Mail::to($user->email)->send(new AccountCreated($user));
                }
            });

            /** @var \App\Models\User $user */
            $user = User::where('email', $tokenData['email'])->first();
            Auth::login($user, true);
            $request->session()->regenerate();
            Log::info('Login: Success', ['email' => $user->email, 'id' => $user->id]);

            return redirect()->route('home');
        } catch (\Exception $error) {
            Log::error('Login: Failure', ['message' => $error->getMessage()]);
            return response()
                ->view('pages.login', ['error' => __('login.error--generic')])
                ->setStatusCode(400);
        }
    }

    /**
     * The login page (GET)
     */
    public function login()
    {
        return view('pages.login');
    }

    /**
     * Logging out (POST)
     */
    public function logout()
    {
        Auth::logout();
        return redirect()->route('home');
    }

    /**
     * The user's personal profile page (GET)
     */
    public function me(UserMeRequest $request)
    {
        return view('pages.me');
    }

    /**
     * The user's items page (GET)
     */
    public function items(UserItemsRequest $request)
    {
        $items = $request->user()
            ->items()
            ->with(['images'])
            ->latest()
            ->paginate(15);
        return view('pages.my-items', ['items' => $items]);
    }
}
