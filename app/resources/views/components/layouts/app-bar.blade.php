<nav class="bg-transparent flex flex-row p-4">
    <div class="flex grow">
        <a class="flex flex-row items-center space-x-4" href="{{ route('home') }}">
            <img
                alt="{{ __('application.name') }}"
                src="{{ asset('images/iamcare-32x32.png') }}"
            />
            <p class="font-black text-xl text-secondary">
                {{ __('application.name') }}
            </p>
        </a>
    </div>

    <div class="flex-none items-center space-x-4">
        <button class="dark:text-gray-400 dark:hover:text-secondary text-primary hover:text-secondary">
            <span class="material-symbols-outlined">
                search
            </span>
        </button>

        <a
            class="dark:text-gray-400 dark:hover:text-secondary text-primary hover:text-secondary"
        >
            <span class="material-symbols-outlined">
                account_circle
            </span>
        </a>
    </div>
</nav>
