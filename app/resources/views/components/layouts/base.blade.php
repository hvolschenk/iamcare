<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <title>{{ $title ?? __('application.name') }}</title>

        <meta charset="UTF-8" />
        <meta
            content="width=device-width, initial-scale=1, minimum-scale=1"
            name="viewport"
        />
        <meta name="htmx-config" content='{"inlineStyleNonce":"{{ csp_nonce() }}"}'>

        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossorigin href="https://fonts.gstatic.com" rel="preconnect" />
        <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
            rel="stylesheet"
        />

        <link
            href="{{ asset('styles/app-compiled.css') }}"
            rel="stylesheet"
        />

        <link
            href="{{ asset('images/iamcare-32x32.png') }}"
            rel="icon"
            sizes="32x32"
            type="image/png"
        />
        <link
            href="{{ asset('images/iamcare-16x16.png') }}"
            rel="icon"
            sizes="16x16"
            type="image/png"
        />

        <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
            rel="stylesheet"
        />

        <script src="https://unpkg.com/htmx.org@2.0.2"></script>

        {{ $scripts ?? '' }}
    </head>
    <body class="bg-gray-100 dark:bg-gray-800">

        @include('components.layouts.app-bar')

        <main class="container mt-4 mx-auto px-10">
            {{ $slot }}
        </main>

        @include('components.layouts.footer')
    </body>
</html>
