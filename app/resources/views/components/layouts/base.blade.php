<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->currentLocale()) }}">
    <head>
        <title>{{ $title ?? config('app.name') }}</title>

        <meta charset="UTF-8" />
        <meta
            content="width=device-width, initial-scale=1, minimum-scale=1"
            name="viewport"
        />
        {{--
            This is really not ideal.
            https://github.com/spatie/laravel-csp/discussions/161
        --}}
        <meta name="htmx-config" content='{"inlineStyleNonce":"{{ app('csp-nonce') }}"}'>

        <meta property="og:site_name" content="{{ config('app.name') }}" />
        <meta property="og:locale" content="{{ str_replace('_', '-', app()->currentLocale()) }}" />
        @if (isset($meta))
            {{ $meta }}
        @else
            <meta property="og:url" content="{{ config('app.url') }}" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="{{ $title ?? config('app.name') }}" />
            <meta property="og:description" content="{{ __('application.slogan') }}" />
            <meta property="og:image" content="{{ asset('images/iamcare-512x512.png') }}" />
            <meta property="og:image:width" content="512" />
            <meta property="og:image:height" content="512" />
            <meta property="og:image:type" content="image/png" />
        @endif

        <script async src="https://www.googletagmanager.com/gtag/js?id={{ config('google.analytics.measurement_id') }}"></script>
        <script @cspNonce>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '{{ config('google.analytics.measurement_id') }}');

            const consentDefault = "{{ config('app.cookie_consent_required') === true ? 'denied' : 'granted' }}";
            const cookiesAccepted = document.cookie
				.split("; ")
				.find((cookie) => cookie.startsWith(`COOKIES_ACCEPTED=`))
				?.split("=")[1] === '1';
            const consentActual = cookiesAccepted ? 'granted' : consentDefault;
            gtag('consent', 'default', {
                ad_storage: consentActual,
                ad_user_data: consentActual,
                ad_personalization: consentActual,
                analytics_storage: consentActual,
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
            href="{{ asset('styles/markdown.css') }}"
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

        @if (config('app.cookie_consent_required') === true)
            <script src="{{ asset('scripts/cookie-dialog.js') }}" type="module"></script>
        @endif
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

        <x-layouts.cookie-dialog />
        <x-layouts.base.language-dialog />
        <x-layouts.base.search-dialog />
    </body>
</html>
