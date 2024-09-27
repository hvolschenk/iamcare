<x-layouts.base>
    <x-slot:title>
        {{ __('me.page-title') }}
    </x-slot>

    <h1 class="dark:text-gray-50 font-bold mb-10 text-5xl text-gray-800">
        {{ __('me.page-title') }}
    </h1>

    <ul class="list-none">
        <li class="block dark:hover:bg-gray-700 hover:bg-gray-200">
            <a class="block p-4" href="{{ route('logout') }}">
                <p class="dark:text-gray-50 text-gray-800">{{ __('me.logout') }}</p>
            </a>
        </li>
    </ul>
</x-layouts.base>
