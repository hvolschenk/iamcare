<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <title>{{ $title ?? 'DEFAULT TITLE' }}</title>
        <link rel="stylesheet" href="https://unpkg.com/mvp.css" />
        <script src="https://unpkg.com/htmx.org@2.0.2"></script>
        <script src="{{ asset('js/htmx/reset-after-submit.js') }}"></script>
    </head>
    <body hx-ext="reset-after-submit">
        <header>
            <nav>
                <a href="/">HTMX</a>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/todos">TODOs</a></li>
                </ul>
            </nav>
        </header>
        <main>
            {{ $slot }}
        </main>
    </body>
</html>
