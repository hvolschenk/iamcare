<?php

namespace App\Http\Middleware;

use App\Services\GooglePlaces;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class LanguageMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $language = $request->cookie(
            'LANGUAGE',
            $request->getPreferredLanguage(GooglePlaces::SUPPORTED_LANGUAGES),
        );
        App::setLocale($language);

        $response = $next($request);
        $response->headers->add(['Content-Language' => $language]);

        return $response;
    }
}
