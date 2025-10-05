<?php

namespace App\Http\Controllers;

use App\Enums\AuthenticationProvider;
use App\Http\Requests\MyItemsRequest;
use App\Models\User;
use App\Models\UserReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * The user's items page (GET)
     */
    public function items(MyItemsRequest $request)
    {
        $validated = $request->safe(['deleted', 'given']);
        $deleted = $validated['deleted'] ?? null;
        $given = $validated['given'] ?? null;

        $query = $request->user()
            ->items()
            ->with(['images']);

        if ($deleted) {
            $query
                ->withTrashed()
                ->with([
                    'images' => fn ($query) => $query->withTrashed(),
                ]);
        }

        if (!$given) {
            $query->where('is_given', false);
        }

        $items = $query
            ->latest()
            ->paginate(12);
        return view(
            'pages.my-items',
            [
                'hasFilter' => $deleted === '1' || $given === '1',
                'items' => $items,
            ],
        );
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
        $user->load(['items' => fn ($query) => $query->where('is_given', false)]);
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
