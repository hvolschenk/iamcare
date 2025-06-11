<?php

namespace App\Http\Controllers;

use App\Enums\AuthenticationProvider;
use App\Models\User;
use App\Models\UserReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * The user's items page (GET)
     */
    public function items(Request $request)
    {
        $items = $request->user()
            ->items()
            ->with(['images'])
            ->latest()
            ->paginate(12);
        return view('pages.my-items', ['items' => $items]);
    }

    /**
     * Update the user's preferred language (GET)
     */
    public function language(Request $request, string $language)
    {
        $cookie = cookie('LANGUAGE', $language);
        if (Auth::check()) {
            $request->user()->updateLanguage($language);
        }
        return redirect()->back()->cookie($cookie);
    }

    /**
     * The user's personal profile page (GET)
     */
    public function me()
    {
        return view('pages.me');
    }

    /**
     * The user's personal profile page (GET)
     */
    public function profile(Request $request)
    {
        $error = $request->query('error');
        $user = $request->user();

        $google = $user->authenticationMethods->first(function ($authenticationMethod) {
            return $authenticationMethod->type === AuthenticationProvider::Google->value;
        });
        $microsoft = $user->authenticationMethods->first(function ($authenticationMethod) {
            return $authenticationMethod->type === AuthenticationProvider::Microsoft->value;
        });

        return view(
            'pages.my-profile',
            [
                'error' => $error,
                'google' => $google,
                'microsoft' => $microsoft,
                'user' => $user,
            ],
        );
    }

    /**
     * A user's profile
     */
    public function user(Request $request, User $user)
    {
        $reported = $user;
        $reporter = $request->user();

        if ($reporter === null || $reporter->id === $reported->id) {
            $userReport = null;
        } else {
            $userReport = UserReport::whereRelation('userReported', 'id', $reported->id)
                ->whereRelation('userReporter', 'id', $reporter->id)
                ->first();
        }

        return view('pages.user', ['user' => $user, 'userReport' => $userReport]);
    }
}
