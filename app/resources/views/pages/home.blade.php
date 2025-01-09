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
</x-layouts.base>
