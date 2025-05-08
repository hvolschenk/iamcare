<nav class="bg-transparent flex flex-row p-4">
    <div class="flex grow">
        <a class="flex flex-row items-center space-x-4" href="{{ route('home') }}">
            <img
                alt="{{ config('app.name') }}"
                src="{{ asset('images/iamcare-32x32.png') }}"
            />
            <p class="font-black text-xl text-secondary">
                {{ config('app.name') }}
            </p>
        </a>
    </div>
</nav>
