<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserReportHandlerRequest;
use App\Http\Requests\UserReportRequest;
use App\Mail\UserReported;
use App\Models\User;
use App\Models\UserReport;
use Illuminate\Support\Facades\Mail;

class UserReportController extends Controller
{
    /**
     * The report user page (GET)
     */
    public function report(UserReportRequest $request, User $user)
    {
        $reported = $user;
        $reporter = $request->user();
        $userReport = UserReport::whereRelation('userReported', 'id', $reported->id)
            ->whereRelation('userReporter', 'id', $reporter->id)
            ->first();

        return view(
            'pages.report-user.report-user',
            ['user' => $user, 'userReport' => $userReport],
        );
    }

    public function reportForm(User $user)
    {
        return view('pages.report-user.form', ['user' => $user]);
    }

    /**
     * Report another user (POST)
     */
    public function reportHandler(UserReportHandlerRequest $request, User $user)
    {
        $validated = $request->safe(['reason']);
        $reason = $validated['reason'];
        $reported = $user;
        $reporter = $request->user();

        $userReport = new UserReport(['reason' => $reason]);
        $userReport->userReported()->associate($reported);
        $userReport->userReporter()->associate($reporter);
        $userReport->save();

        Mail::to(config('mail.report_to'))->send(new UserReported($userReport));

        return response(null, 204, ['Hx-Redirect' => route('user', $user)]);
    }
}
