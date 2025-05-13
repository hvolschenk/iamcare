<footer class="mb-10 mt-10 text-center">
    <p class="font-bold">
        &copy; {{ date("Y") }} - {{ config('app.name') }}
    </p>
    <p class="font-light">
        {{ __('application.slogan') }}
    </p>

    <div class="flex flex-row gap-3 justify-center mt-2">
        <a href="{{ config('services.facebook.profile_url') }}" rel="noopener noreferrer" target="_blank">
            <img
                alt="{{ __('social--facebook') }}"
                class="dark:hidden h-6 inline w-6"
                height="24"
                src="{{ asset('images/social/facebook.webp') }}"
                width="24"
            />
            <img
                alt="{{ __('social--facebook') }}"
                class="dark:inline h-6 hidden w-6"
                height="24"
                src="{{ asset('images/social/facebook-alternate.webp') }}"
                width="24"
            />
        </a>
        <a href="{{ config('services.x.profile_url') }}" rel="noopener noreferrer" target="_blank">
            <img
                alt="{{ __('social--x') }}"
                class="dark:hidden h-6 inline w-6"
                height="24"
                src="{{ asset('images/social/x.webp') }}"
                width="24"
            />
            <img
                alt="{{ __('social--x') }}"
                class="dark:inline h-6 hidden w-6"
                height="24"
                src="{{ asset('images/social/x-alternate.webp') }}"
                width="24"
            />
        </a>
    </div>

    <p class="font-light mt-4 text-sm">
        <a class="hover:underline" href="https://ikbenzorg.nl">
            🇳🇱 {{ __('application.country--netherlands') }}
        </a>
        &bull;
        <a class="hover:underline" href="https://iamcare.co.za">
            🇿🇦 {{ __('application.country--south-africa') }}
        </a>
    </p>

    <p class="font-light mt-1 text-sm">
        <a class="hover:underline" href="{{ route('privacyPolicy') }}">
            {{ __('legal.privacy-policy') }}
        </a>
        &bull;
        <a class="hover:underline" href="{{ route('termsOfUse') }}">
            {{ __('legal.terms-of-use') }}
        </a>
    </p>
</footer>
