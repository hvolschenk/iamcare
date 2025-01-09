<x-layouts.base>
    <x-slot:title>
        {{ $item->name }}
    </x-slot>

    <x-slot:meta>
        <meta property="og:title" content="{{ $item->name }}" />
        <meta property="og:description" content="{{ $item->description }}" />
        <meta property="og:type" content="product" />
        <meta property="og:image" content="{{ $item->images[0]->get() }}" />
    </x-slot>

    <x-slot:scripts>
        <script src="{{ asset('scripts/image-carousel.js') }}"></script>
        <script nonce="{{ csp_nonce() }}" type="module">
            const $imageCarouselContainer = document.getElementById(
                "item__image-carousel",
            );
            const imageCarousel = new ImageCarousel($imageCarouselContainer);
            imageCarousel.initialize();
        </script>
    </x-slot>

    <h1 class="font-bold mb-10 text-5xl">
        {{ $item->name }}
    </h1>

    <div
        class="bg-neutral-200 dark:bg-neutral-700 flex h-80 justify-center relative"
        id="item__image-carousel"
    >
        <button class="absolute disabled:cursor-not-allowed hover:bg-white/20 left-0 h-full px-4" type="button">
            <span class="material-symbols-outlined">chevron_left</span>
        </button>
        @foreach ($item->images as $image)
            <img alt="{{ $item->name }}" class="h-full" src="{{ $image->get() }}" />
        @endforeach
        <button class="absolute disabled:cursor-not-allowed hover:bg-white/20 h-full px-4 right-0" type="button">
            <span class="material-symbols-outlined">chevron_right</span>
        </button>
    </div>

    <div class="flex flex-col-reverse gap-4 md:grid md:grid-cols-2 mt-6">
        <div class="flex flex-col gap-4">
            <x-user-glance :user="$item->user" />
            <p>{{ $item->description }}</p>
        </div>
        <div
            class="
                bg-neutral-50
                border
                border-neutral-500
                dark:bg-neutral-900
                dark:hover:bg-black
                dark:hover:border-neutral-400
                hover:bg-white
                hover:border-neutral-600
                p-4
                rounded"
        >
            <p class="flex flex-wrap gap-1 mt-2 pb-1">
                @foreach ($item->tags as $tag)
                    <x-tag :tag="$tag" />
                @endforeach
            </p>
            <p class="flex gap-2 mt-4">
                <span class="material-symbols-outlined">location_on</span>
                <a
                    class="dark:text-neutral-300 hover:underline text-neutral-500"
                    href="{{ route(
                        'search',
                        ['distance' => '20', 'location' => $item->location->googlePlaceID],
                    ) }}"
                >
                    {{ $item->location->name }}
                </a>
            </p>
        </div>
    </div>
    <a
        class="
            bg-primary
            dark:disabled:bg-neutral-500
            dark:disabled:text-neutral-200
            disabled:bg-neutral-200
            disabled:text-neutral-500
            flex
            gap-2
            hover:bg-primary/80
            md:max-w-fit
            md:w-auto
            mt-4
            px-4
            py-2
            rounded
            text-neutral-50
            w-full"
        href="{{ route('threadCreate', $item) }}"
    >
        <span class="material-symbols-outlined">send</span>
        {{ __('item.actionContactGiver') }}
    </a>
</x-layouts.base>
