<x-layouts.base>
    <section class="py-40 text-center">
        <h1 class="font-bold text-2xl">
            {{ config('app.name') }}
        </h1>
        <p class="dark:text-neutral-200 font-light">
            {{ __('application.slogan') }}
        </p>
    </section>

    <section class="gap-4 grid md:grid-cols-2 space-y-4">
        <x-card class="flex flex-col h-full">
            <h2 class="font-bold mb-4 text-xl text-primary">
                {{ __('home.give__title') }}
            </h2>
            <p class="font-normal mb-2 text-lg">
                {{ __('home.give__sub-heading') }}
            </p>
            <p class="flex font-light grow-1">
                {{ __('home.give__description') }}
            </p>
            <a
                class="block hover:bg-primary/20 mt-4 py-1 rounded-sm text-center text-primary w-full"
                href="{{ route('itemGive') }}"
            >
                {{ __('home.give__action') }}
            </a>
        </x-card>

        <x-card class="flex flex-col h-full">
            <h2 class="font-bold mb-4 text-xl text-secondary">
                {{ __('home.take__title') }}
            </h2>
            <p class="font-normal mb-2 text-lg">
                {{ __('home.take__sub-heading') }}
            </p>
            <p class="flex font-light grow-1">
                {{ __('home.take__description') }}
            </p>
            <button
                class="
                    cursor-pointer
                    hover:bg-secondary/20
                    mt-4
                    py-1
                    rounded-sm
                    text-secondary
                    w-full
                    search-dialog__button"
            >
                {{ __('home.take__action') }}
            </button>
        </x-card>
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
            class="gap-2 hover:bg-primary/20 inline-flex mt-3 py-1 px-2 rounded-sm text-center text-primary"
            href="https://github.com/hvolschenk/iamcare"
        >
            <span class="material-symbols-outlined">bug_report</span>
            {{ __('home.issues-suggestions__action') }}
        </a>
    </section>

    @if (count($popularTags) > 0)
        <x-card class="mt-12 pb-6">
            <h2 class="font-bold mb-4 text-xl">
                {{ __('home.popular-tags__title') }}
            </h2>
            <div class="gap-4 grid grid-cols-2 md:grid-cols-3">
                @foreach ($popularTags as $popularTag)
                    <p>
                        <x-tag class="text-sm!" :tag="$popularTag">
                            <span class="bg-neutral-300 dark:bg-neutral-900 inline-flex ml-2 px-2 py-1/2 rounded-full">
                                {{ $popularTag->items_count }}
                            </span>
                        </x-tag>
                    </p>
                @endforeach
            </div>
        </x-card>
    @endif

    @if (count($latestGivenItems) > 0)
        <section class="mt-6">
            <h2 class="font-bold mb-4 text-xl">
                {{ __('home.latest-given-items__title') }}
            </h2>
            <x-items-list :items="$latestGivenItems" />
        </section>
    @endif
</x-layouts.base>
