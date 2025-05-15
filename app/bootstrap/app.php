<?php

use App\Http\Middleware\CorrelationIDMiddleware;
use App\Http\Middleware\LanguageMiddleware;
use App\Http\Middleware\SecurityHeadersMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Mazedlx\FeaturePolicy\AddFeaturePolicyHeaders;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(['LANGUAGE']);
        $middleware->append(\Spatie\Csp\AddCspHeaders::class);
        $middleware->append(LanguageMiddleware::class);
        $middleware->web(AddFeaturePolicyHeaders::class);
        $middleware->web(CorrelationIDMiddleware::class);
        $middleware->web(SecurityHeadersMiddleware::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
