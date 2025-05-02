<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;

/**
 * A controller to handle all legal pages.
 */
class LegalController extends Controller
{
    public function legal()
    {
        return view('pages.legal');
    }

    public function privacyPolicy()
    {
        $privacyPolicy = Str::markdown(
            __('privacy-policy.'.config('app.region'), ['applicationName' => config('app.name')]),
            ['allow_unsafe_links' => false, 'html_input' => 'strip'],
        );

        return view('pages.privacy-policy', ['privacyPolicy' => $privacyPolicy]);
    }

    public function termsOfUse()
    {
        $termsOfUse = Str::markdown(
            __('terms-of-use.'.config('app.region'), ['applicationName' => config('app.name')]),
            ['allow_unsafe_links' => false, 'html_input' => 'strip'],
        );

        return view('pages.terms-of-use', ['termsOfUse' => $termsOfUse]);
    }
}
