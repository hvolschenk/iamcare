<x-layouts.base>
    <x-slot:title>
        {{ __('my-items.page-title') }}
    </x-slot>

    <x-slot:scripts>
        <script src="{{ asset('scripts/menu-click-away-closer.js') }}"></script>
        <script @cspNonce type="module">
            const menuClickAwayCloser = new MenuClickAwayCloser('details.my-items__item__menu');
            menuClickAwayCloser.initialize();
        </script>
    </x-slot>

    <x-page-title
        :breadcrumbs="[
            ['title' => __('home.breadcrumb'), 'url' => route('home')],
            ['title' => __('me.breadcrumb'), 'url' => route('me')],
            ['title' => __('my-items.breadcrumb')],
        ]"
    >
        <div class="flex flex-row justify-between">
            <span>{{ __('my-items.page-title') }}</span>
            <a
                class="dark:text-neutral-400 dark:hover:text-secondary flex items-center text-primary hover:text-secondary"
                href="{{ route('itemGive') }}"
            >
                <span class="material-symbols-outlined">add_circle</span>
            </a>
        </div>
    </x-page-title>

    <details class="bg-neutral-50 border border-neutral-500 dark:bg-neutral-900 mb-4 rounded-sm">
        <summary class="cursor-pointer p-4">
            <span class="pr-2 relative">
                {{ __('my-items.filter__title') }}
                @if ($hasFilter)
                    <x-badge></x-badge>
                @endif
            </span>
        </summary>
        <form action="{{ route('myItems') }}" class="m-4" method="GET">
            <div class="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div>
                    <label class="flex gap-2 items-center" for="my-items__show-deleted">
                        <input
                            @if (app('request')->input('deleted') === '1')
                                checked
                            @endif
                            id="my-items__show-deleted"
                            name="deleted"
                            type="checkbox"
                            value="1"
                        />
                        {{ __('my-items.filter__show--deleted') }}
                    </label>
                </div>
                <div>
                    <label class="flex gap-2 items-center" for="my-items__show-given">
                        <input
                            @if (app('request')->input('given') === '1')
                                checked
                            @endif
                            id="my-items__show-given"
                            name="given"
                            type="checkbox"
                            value="1"
                        />
                        {{ __('my-items.filter__show--given') }}
                    </label>
                </div>
            </div>
            <x-button class="mt-2" type="submit">
                {{ __('my-items.filter__action--filter') }}
            </x-button>
        </form>
    </details>

    @if ($items->isEmpty())
        <x-alert>
            <div class="flex flex-row grow justify-between">
                <span>{{ __('my-items.error--no-items') }}</span>
                <a href="{{ route('itemGive') }}">
                    {{ __('item.give') }}
                </a>
            </div>
        </x-alert>
    @else
        <x-card>
            <ul class="dark:divide-neutral-700 divide-y divide-neutral-200 list-none">
                @foreach ($items as $item)
                    <li class="dark:hover:bg-neutral-700 flex gap-4 hover:bg-neutral-200 items-center">
                        <a class="flex grow gap-4 items-center p-4 min-w-0" href="{{ route('item', $item) }}">
                            <img
                                class="
                                    aspect-square
                                    border
                                    border-neutral-500
                                    @if ($item->is_given || $item->trashed())
                                        grayscale
                                    @endif
                                    rounded-sm size-16"
                                src="{{ $item->images[0]->get(64, 64) }}"
                            />
                            <div class="flex flex-col gap-2 grow min-w-0 overflow-hidden">
                                <p class="truncate">{{ $item->name }}</p>
                                @if ($item->is_given)
                                    <x-chip>{{ __('item.given') }}</x-chip>
                                @elseif ($item->trashed())
                                    <x-chip>{{ __('item.deleted') }}</x-chip>
                                @else
                                    <p class="truncate">{{ $item->description }}</p>
                                @endif
                            </div>
                        </a>
                        <details class="mr-4 my-items__item__menu relative shrink-0">
                            <summary class="cursor-pointer flex items-center">
                                <span class="material-symbols-outlined">
                                    menu
                                </span>
                            </summary>
                            <ul class="absolute border border-neutral-500 dark:bg-neutral-700 bg-neutral-200 py-1 right-0 z-10">
                                <li class="whitespace-nowrap">
                                    <a class="block dark:hover:bg-neutral-600 hover:bg-neutral-100 px-4 py-2" href="{{ route('itemEdit', $item) }}">
                                        {{ __('item.edit') }}
                                    </a>
                                </li>
                                <li class="whitespace-nowrap">
                                    <form>
                                        @csrf
                                        <a
                                            class="block cursor-pointer dark:hover:bg-neutral-600 hover:bg-neutral-100 px-4 py-2"
                                            hx-confirm="{{ __('item.confirmDelete') }}"
                                            hx-delete="{{ route('itemDelete', $item) }}"
                                            hx-disabled-elt="this"
                                        >
                                            {{ __('item.delete') }}
                                        </a>
                                    </form>
                                </li>
                            </ul>
                        </details>
                    </li>
                @endforeach
            </ul>
        </x-card>

        <div class="flex flex-col flex-wrap gap-4 items-center justify-center mb-4 md:items-end mt-6">
            {{ $items->links() }}
        </div>
    @endif
</x-layouts.base>
