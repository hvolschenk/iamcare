<x-layouts.base>
    <x-slot:title>
        {{ __('my-items.page-title') }}
    </x-slot>

    <x-slot:scripts>
        <script src="{{ asset('scripts/menu-click-away-closer.js') }}"></script>
        <script nonce="{{ csp_nonce() }}" type="module">
            const menuClickAwayCloser = new MenuClickAwayCloser('details.my-items__item__menu');
            menuClickAwayCloser.initialize();
        </script>
    </x-slot>

    <h1 class="font-bold mb-10 text-5xl">
        {{ __('my-items.page-title') }}
    </h1>

    <ul class="dark:divide-gray-700 divide-y divide-gray-200 list-none">
        @foreach ($items as $item)
            <li class="dark:hover:bg-gray-700 flex gap-4 hover:bg-gray-200 items-center">
                <a class="flex flex-grow gap-4 items-center p-4" href="{{ route('item', $item) }}">
                    <img
                        class="border border-gray-500 rounded"
                        src="{{ $item->images[0]->get(32, 32) }}"
                    />
                    <div class="flex flex-grow overflow-hidden">
                        <p class="truncate">{{ $item->name }}</p>
                    </div>
                </a>
                <details class="mr-4 my-items__item__menu relative">
                    <summary class="cursor-pointer flex items-center">
                        <span class="material-symbols-outlined">
                            menu
                        </span>
                    </summary>
                    <ul class="absolute border border-gray-500 dark:bg-gray-700 bg-gray-200 py-1 right-0 z-10">
                        <li class="whitespace-nowrap">
                            <a class="block dark:hover:bg-gray-600 hover:bg-gray-100 px-4 py-2" href="{{ route('itemEdit', $item) }}">
                                {{ __('item.edit') }}
                            </a>
                        </li>
                        <li class="px-4 py-2 whitespace-nowrap">{{ __('item.delete') }}</li>
                    </ul>
                </details>
            </li>
        @endforeach
    </ul>

    <div class="flex flex-col flex-wrap gap-4 items-center justify-center mb-4 md:items-end mt-6">
        {{ $items->links() }}
    </div>
</x-layouts.base>
