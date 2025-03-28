<x-layouts.base>
    <x-slot:title>
        {{ __('login.login') }}
    </x-slot>

    <x-page-title
        :breadcrumbs="[
            ['title' => __('home.breadcrumb'), 'url' => route('home')],
            ['title' => __('login.breadcrumb')],
        ]"
    >
        {{ __('login.login') }}
    </x-page-title>

    <div class="flex justify-center">
        @if (isset($error))
            <p class="
                bg-red-100
                border
                border-red-600
                dark:bg-red-900
                dark:border-red-950
                dark:text-red-100
                mb-4
                p-1
                px-4
                rounded-sm
                text-red-600"
            >
                {{ $error }}
            </p>
        @endif

        <x-link.button class="w-3xs" href="{{ route('loginGoogleRedirect') }}">
            <img
                alt="{{ __('login.provider--google') }}"
                class="h-6 mr-3 w-6"
                height="24"
                src="{{ asset('images/social/google.webp') }}"
                width="24"
            />
            {{ __('login.provider--google') }}
        </x-link.button>
    </div>
</x-layouts.base>
