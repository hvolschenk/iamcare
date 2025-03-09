<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->currentLocale()) }}">
    <head>
        <title>{{ $title ?? __('application.name') }}</title>

        <meta charset="UTF-8" />
        <meta
            content="width=device-width, initial-scale=1, minimum-scale=1"
            name="viewport"
        />
        <meta name="htmx-config" content='{"inlineStyleNonce":"{{ csp_nonce() }}"}'>
        {{ $meta ?? '' }}

        <script async src="https://www.googletagmanager.com/gtag/js?id={{ config('google.analytics.measurement_id') }}"></script>
        <script nonce="{{ csp_nonce() }}">
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '{{ config('google.analytics.measurement_id') }}');

            const consentDefault = "{{ config('app.cookie_consent_required') === true ? 'denied' : 'granted' }}";
            gtag('consent', 'default', {
                ad_storage: consentDefault,
                ad_user_data: consentDefault,
                ad_personalization: consentDefault,
                analytics_storage: consentDefault,
            });
        </script>

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

        <script src="https://unpkg.com/htmx.org@2.0.4"></script>

        <script src="{{ asset('scripts/language-dialog.js') }}" type="module"></script>
        <script src="{{ asset('scripts/search-dialog.js') }}" type="module"></script>
        {{ $scripts ?? '' }}
    </head>
    <body class="bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-50 text-neutral-800">
        <x-layouts.base.app-bar />

        <main class="container md:px-10 mt-4 mx-auto px-4">
            {{ $slot }}
        </main>

        <x-layouts.base.footer />

        <x-layouts.base.language-dialog />
        <x-layouts.base.search-dialog />
    </body>
</html>
