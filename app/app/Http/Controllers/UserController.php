<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserLoginHandlerGoogleRequest;
use App\Mail\AccountCreated;
use App\Models\User;
use App\Models\UserReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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
    public function language(string $language)
    {
        $cookie = cookie('LANGUAGE', $language);
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
