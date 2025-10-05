<a
    class="dark:hover:bg-neutral-700 flex flex-row gap-4 hover:bg-neutral-200 p-2 w-full"
    @if (!$item->trashed())
        href="{{ route('item', $item) }}"
    @endif
>
    <img
        alt="{{ $item->name }}"
        class="
            aspect-square
            border-2
            border-primary
            dark:border-neutral-400
            @if ($item->is_given || $item->trashed())
                grayscale
            @endif
            size-12"
        src="{{ $item->images[0]->get(32, 32) }}"
    />
    <div class="flex flex-col grow min-w-0">
        <h5 class="font-bold">{{ $item->name }}</h5>
        @if ($item->is_given)
            <x-chip>{{ __('item.given') }}</x-chip>
        @elseif ($item->trashed())
            <x-chip>{{ __('item.deleted') }}</x-chip>
        @else
            <p class="truncate">{{ $item->description }}</p>
        @endif
    </div>
</a>
