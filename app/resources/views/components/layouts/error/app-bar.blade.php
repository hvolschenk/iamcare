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
</nav>
