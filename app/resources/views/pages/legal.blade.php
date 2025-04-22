<x-layouts.base>
    <x-slot:title>
        {{ __('legal.page-title') }}
    </x-slot>

    <x-page-title
        :breadcrumbs="[
            ['title' => __('home.breadcrumb'), 'url' => route('home')],
            ['title' => __('legal.breadcrumb')],
        ]"
    >
        {{ __('legal.page-title') }}
    </x-page-title>

    <x-card>
        <ul class="list-none">
            <li class="block dark:hover:bg-neutral-700 hover:bg-neutral-200">
                <a class="block p-4" href="{{ route('privacyPolicy') }}">
                    <p>{{ __('legal.privacy-policy') }}</p>
                </a>
            </li>
            <li class="block dark:hover:bg-neutral-700 hover:bg-neutral-200">
                <a class="block p-4" href="{{ route('termsOfUse') }}">
                    <p>{{ __('legal.terms-of-use') }}</p>
                </a>
            </li>
        </ul>
    </x-card>
</x-layouts.base>
