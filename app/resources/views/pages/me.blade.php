<x-layouts.base>
    <x-slot:title>
        {{ __('me.page-title') }}
    </x-slot>

    <h1 class="font-bold mb-10 text-5xl">
        {{ __('me.page-title') }}
    </h1>

    <ul class="list-none">
        <li class="block dark:hover:bg-gray-700 hover:bg-gray-200">
            <a class="block p-4" href="{{ route('myItems') }}">
                <p>{{ __('me.my-items') }}</p>
            </a>
        </li>
        <li class="block dark:hover:bg-gray-700 hover:bg-gray-200">
            <a class="block p-4" href="{{ route('threads') }}">
                <p>{{ __('me.inbox') }}</p>
            </a>
        </li>
        <li class="block dark:hover:bg-gray-700 hover:bg-gray-200">
            <a class="block p-4" href="{{ route('logout') }}">
                <p>{{ __('me.logout') }}</p>
            </a>
        </li>
    </ul>
</x-layouts.base>
