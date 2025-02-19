<ul class="gap-4 grid grid-cols-1 lg:grid-cols-4 list-none md:grid-cols-3">
    @foreach ($items as $item)
        <li
            class="
                bg-neutral-50
                border
                border-neutral-500
                dark:bg-neutral-900
                dark:hover:bg-black
                dark:hover:border-neutral-400
                hover:bg-white
                hover:border-neutral-600
                rounded"
        >
            <a href="{{ route('item', $item) }}">
                <img
                    class="aspect-square w-full"
                    src="{{ $item->images[0]->get(300, 300) }}"
                />
            </a>
            <div class="p-4">
                <a href="{{ route('item', $item) }}">
                    <p class="font-bold truncate">{{ $item->name }}</p>
                </a>
                <a
                    class="dark:text-neutral-300 hover:underline text-neutral-500"
                    href="{{ route(
                        'search',
                        ['distance' => '20', 'location' => $item->location->googlePlaceID],
                    ) }}"
                >
                    {{ $item->location->name }}
                </a>
                <p class="mt-2 truncate">{{ $item->description }}</p>
                <p class="flex gap-1 mt-2 overflow-x-hidden pb-1 whitespace-nowrap">
                    @foreach ($item->tags as $tag)
                        <x-tag :tag="$tag" />
                    @endforeach
                </p>
            </div>
        </li>
    @endforeach
</ul>
