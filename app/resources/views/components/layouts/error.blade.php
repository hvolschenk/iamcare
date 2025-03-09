<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->currentLocale()) }}">
    <head>
        <title>{{ $title ?? __('application.name') }}</title>

        <meta charset="UTF-8" />
        <meta
            content="width=device-width, initial-scale=1, minimum-scale=1"
            name="viewport"
        />
        {{ $meta ?? '' }}

        <script async src="https://www.googletagmanager.com/gtag/js?id={{ config('google.analytics.measurement_id') }}"></script>
        <script nonce="{{ csp_nonce() }}">
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

        @if (config('app.cookie_consent_required') === true)
            <script src="{{ asset('scripts/cookie-dialog.js') }}" type="module"></script>
        @endif
        {{ $scripts ?? '' }}
    </head>
    <body class="bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-50 flex flex-col min-h-screen text-neutral-800">
        <div class="basis-auto flex flex-grow-0 flex-shrink">
            <x-layouts.error.app-bar />
        </div>

        <main class="basis-auto container flex flex-grow flex-shrink items-center justify-center md:px-6 px-4">
            <section class="text-center">
                <h1 class="font-bold text-2xl">
                    {{ __("errors.{$code}__title") }}
                </h1>
                <p class="dark:text-neutral-200 font-light">
                    {{ __("errors.{$code}__description") }}
                </p>
            </section>
        </main>

        <x-layouts.cookie-dialog />
    </body>
</html>
