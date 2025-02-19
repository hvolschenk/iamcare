<x-layouts.base>
    <section class="py-40 text-center">
        <h1 class="font-bold text-2xl">
            {{ __('application.name') }}
        </h1>
        <p class="dark:text-neutral-200 font-light">
            {{ __('application.slogan') }}
        </p>
    </section>

    <section class="columns-1 space-y-4 md:columns-2 md:space-x-4">
        <div class="bg-white dark:bg-neutral-900 p-4 rounded">
            <h2 class="font-bold mb-4 text-xl text-primary">
                {{ __('home.give__title') }}
            </h2>
            <p class="font-normal mb-2 text-lg">
                {{ __('home.give__sub-heading') }}
            </p>
            <p class="font-light">
                {{ __('home.give__description') }}
            </p>
            <a
                class="block hover:bg-primary/20 mt-4 py-1 rounded text-center text-primary w-full"
                href="{{ route('itemGive') }}"
            >
                {{ __('home.give__action') }}
            </a>
        </div>

        <div class="bg-white dark:bg-neutral-900 p-4 rounded">
            <h2 class="font-bold mb-4 text-xl text-secondary">
                {{ __('home.take__title') }}
            </h2>
            <p class="font-normal mb-2 text-lg">
                {{ __('home.take__sub-heading') }}
            </p>
            <p class="font-light">
                {{ __('home.take__description') }}
            </p>
            <button class="hover:bg-secondary/20 mt-4 py-1 rounded text-secondary w-full">
                {{ __('home.take__action') }}
            </button>
        </div>
    </section>

    @if (count($latestItems) > 0)
        <section class="mt-6">
            <h2 class="font-bold mb-4 text-xl">
                {{ __('home.latest-items__title') }}
            </h2>
            <x-items-list :items="$latestItems" />
        </section>
    @endif

    <section class="mt-12 text-center">
        <h2 class="font-bold mb-4 text-xl">
            {{ __('home.issues-suggestions__title') }}
        </h2>
        <p class="dark:text-neutral-300 text-neutral-500">
            {{ __('home.issues-suggestions__description') }}
        </p>
        <a
            class="gap-2 hover:bg-primary/20 inline-flex mt-3 py-1 px-2 rounded text-center text-primary"
            href="https://github.com"
        >
            <span class="material-symbols-outlined">bug_report</span>
            {{ __('home.issues-suggestions__action') }}
        </a>
    </section>

    @if (count($popularTags) > 0)
        <section
            class="
                bg-neutral-50
                border
                border-neutral-500
                dark:bg-neutral-900
                dark:hover:bg-black
                dark:hover:border-neutral-400
                hover:bg-white
                hover:border-neutral-600
                mt-12
                p-4
                pb-6
                rounded"
        >
            <h2 class="font-bold mb-4 text-xl">
                {{ __('home.popular-tags__title') }}
            </h2>
            <div class="gap-4 grid grid-cols-2 md:grid-cols-3">
                @foreach ($popularTags as $popularTag)
                    <p>
                        <x-tag class="!text-sm" :tag="$popularTag">
                            <span class="bg-neutral-300 dark:bg-neutral-900 inline-flex ml-2 px-2 py-1/2 rounded-full">
                                {{ $popularTag->items_count }}
                            </span>
                        </x-tag>
                    </p>
                @endforeach
            </div>
        </section>
    @endif
</x-layouts.base>
