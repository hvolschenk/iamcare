<?php

use App\Http\Middleware\LanguageMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(['g_csrf_token', 'LANGUAGE']);
        $middleware->append(\Spatie\Csp\AddCspHeaders::class);
        $middleware->append(LanguageMiddleware::class);
        $middleware->validateCsrfTokens(except: ['login/*']);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
