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
    </body>
</html>
