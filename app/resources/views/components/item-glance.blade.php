<a
    class="dark:hover:bg-gray-700 flex flex-row gap-4 hover:bg-gray-200 p-2 w-full"
    href="{{ route('item', $item) }}"
>
    <img
        alt="{{ $item->name }}"
        class="aspect-square border-2 border-primary dark:border-gray-400 size-12"
        src="{{ $item->images[0]->get(32, 32) }}"
    />
    <div
        class="
            @if ($item->isGiven)
                line-through
            @endif
            flex
            flex-col
            flex-grow
            min-w-0"
    >
        <h5 class="font-bold">{{ $item->name }}</h5>
        <p class="truncate">{{ $item->description }}</p>
    </div>
</a>
