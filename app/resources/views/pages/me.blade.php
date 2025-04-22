<x-layouts.base>
    <x-slot:title>
        {{ __('me.page-title') }}
    </x-slot>

    <x-page-title
        :breadcrumbs="[
            ['title' => __('home.breadcrumb'), 'url' => route('home')],
            ['title' => __('me.breadcrumb')],
        ]"
    >
        {{ __('me.page-title') }}
    </x-page-title>

    <x-card>
        <ul class="list-none">
            <li class="block dark:hover:bg-neutral-700 hover:bg-neutral-200">
                <a class="block p-4" href="{{ route('myProfile') }}">
                    <p>{{ __('me.my-profile') }}</p>
                </a>
            </li>
            <li class="block dark:hover:bg-neutral-700 hover:bg-neutral-200">
                <a class="block p-4" href="{{ route('myItems') }}">
                    <p>{{ __('me.my-items') }}</p>
                </a>
            </li>
            <li class="block dark:hover:bg-neutral-700 hover:bg-neutral-200">
                <a class="block p-4" href="{{ route('threads') }}">
                    <p>{{ __('me.inbox') }}</p>
                </a>
            </li>
            <li class="block dark:hover:bg-neutral-700 hover:bg-neutral-200">
                <a class="block p-4" href="{{ route('logout') }}">
                    <p>{{ __('me.logout') }}</p>
                </a>
            </li>
        </ul>
    </x-card>
</x-layouts.base>
