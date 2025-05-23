<nav class="bg-transparent flex flex-row p-4">
    <div class="flex grow">
        <a class="flex flex-row items-center space-x-4" href="{{ route('home') }}">
            <img
                alt="{{ config('app.name') }}"
                src="{{ asset('images/iamcare-32x32.png') }}"
            />
            <p class="font-black relative text-xl text-secondary">
                {{ config('app.name') }}
                <span class="absolute dark:text-neutral-300 font-light -right-5 text-primary text-xs top-0">
                    {{ config('app.region') }}
                </span>
            </p>
        </a>
    </div>

    <div class="flex items-center space-x-4">
        <button
            class="
                cursor-pointer
                dark:text-neutral-400
                dark:hover:text-secondary
                flex
                items-center
                text-primary
                hover:text-secondary
                search-dialog__button"
        >
            <span class="material-symbols-outlined">
                search
            </span>
        </button>

        <button
            class="
                cursor-pointer
                dark:text-neutral-400
                dark:hover:text-secondary
                flex
                items-center
                text-primary
                hover:text-secondary"
            id="language-dialog__button"
        >
            <span class="material-symbols-outlined">
                language
            </span>
        </button>

        @auth
            <a
                class="dark:text-neutral-400 dark:hover:text-secondary flex hover:text-secondary items-center relative text-primary"
                href="{{ route('threads') }}"
            >
                <span class="material-symbols-outlined">
                    inbox
                </span>
                @if ($unreadThreadCount > 0)
                    <x-badge text="{{ $unreadThreadCount }}"></x-badge>
                @endif
            </a>
        @endauth

        @guest
            <a
                class="dark:text-neutral-400 dark:hover:text-secondary flex items-center text-primary hover:text-secondary"
                href="{{ route('login') }}"
            >
                <span class="material-symbols-outlined">
                    account_circle
                </span>
            </a>
        @endguest

        @auth
            <a href="{{ route('me') }}">
                <img
                    alt="{{ Auth::user()->name }}"
                    class="aspect-square border-2 border-primary dark:border-neutral-400 hover:border-secondary rounded-full size-7"
                    referrerpolicy="no-referrer"
                    src="{{ Auth::user()->getAvatar() }}"
                />
            </a>
        @endauth
    </div>
</nav>
