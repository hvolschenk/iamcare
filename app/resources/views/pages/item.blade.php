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
        <script @cspNonce type="module">
            const $imageCarouselContainer = document.getElementById(
                "item__image-carousel",
            );
            const imageCarousel = new ImageCarousel($imageCarouselContainer);
            imageCarousel.initialize();
        </script>
        <script src="{{ asset('scripts/share.js') }}"></script>
        <script @cspNonce type="module">
            const $buttonShare = document.getElementById("item__share");
            const shareData = {
                text: "{{ $item->description }}",
                title: "{{ $item->name }}",
                url: "{{ route('item', $item) }}"
            };
            const share = new Share($buttonShare, shareData);
            share.initialize();
        </script>
    </x-slot>

    <x-page-title
        :breadcrumbs="[
            ['title' => __('home.breadcrumb'), 'url' => route('home')],
            ['title' => $item->name],
        ]"
    >
        <div class="flex flex-row justify-between">
            <span>{{ $item->name }}</span>
            <div class="flex flex-row gap-2 items-center">
                @auth
                    @if (Auth::user()->id !== $item->user->id)
                        <a
                            class="
                                @if ($itemReport === null)
                                    dark:text-neutral-400
                                    dark:hover:text-secondary
                                    text-primary
                                    hover:text-secondary
                                @else
                                    dark:text-secondary
                                    text-secondary
                                @endif
                                flex
                                items-center"
                            href="{{ route('reportItem', $item) }}"
                        >
                            <span class="material-symbols-outlined">flag</span>
                        </a>
                    @endif
                @endauth
                <button
                    class="
                        cursor-pointer
                        dark:disabled:text-neutral-200
                        dark:hover:text-secondary
                        dark:text-neutral-400
                        disabled:cursor-not-allowed
                        disabled:text-neutral-500
                        flex
                        hover:text-secondary
                        text-primary"
                    id="item__share"
                    type="button"
                >
                    <span class="material-symbols-outlined">share</span>
                </button>
            </div>
        </div>
    </x-page-title>

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

    @if ($thread === null)
        @auth
            @if (Auth::user()->id !== $item->user->id)
                <x-link.button class="md:max-w-fit" href="{{ route('threadCreate', $item) }}">
                    <span class="material-symbols-outlined">send</span>
                    {{ __('item.actionContactGiver') }}
                </x-link.button>
            @endif
        @endauth
        @guest
            <x-link.button class="md:max-w-fit" href="{{ route('threadCreate', $item) }}">
                <span class="material-symbols-outlined">send</span>
                {{ __('item.actionContactGiver') }}
            </x-link.button>
        @endguest
    @else
        <x-link.button class="md:max-w-fit" href="{{ route('thread', $thread) }}">
            <span class="material-symbols-outlined">send</span>
            {{ __('item.actionOpenThread') }}
        </x-link.button>
    @endif
</x-layouts.base>
