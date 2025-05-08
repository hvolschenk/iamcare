<footer class="mb-10 mt-10 text-center">
    <p class="font-bold">
        &copy; {{ date("Y") }} - {{ config('app.name') }}
    </p>
    <p class="font-light">
        {{ __('application.slogan') }}
    </p>

    <p class="font-light mt-2 text-sm">
        <a class="hover:underline" href="https://ikbenzorg.nl">
            🇳🇱 {{ __('application.country--netherlands') }}
        </a>
        &bull;
        <a class="hover:underline" href="https://iamcare.co.za">
            🇿🇦 {{ __('application.country--south-africa') }}
        </a>
    </p>

    <p class="font-light mt-4 text-sm">
        <a class="hover:underline" href="{{ route('privacyPolicy') }}">
            {{ __('legal.privacy-policy') }}
        </a>
        &bull;
        <a class="hover:underline" href="{{ route('termsOfUse') }}">
            {{ __('legal.terms-of-use') }}
        </a>
    </p>
</footer>
