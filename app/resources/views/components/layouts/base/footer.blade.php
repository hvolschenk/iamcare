<footer class="mb-10 mt-10 text-center">
    <p class="font-bold">
        &copy; {{ date("Y") }} - {{ __('application.name') }}
    </p>
    <p class="font-light">
        {{ __('application.slogan') }}
    </p>
    <p class="font-light mt-4 text-sm">
        <a class="hover:underline" href="{{ route('privacyPolicy') }}">
            {{ __('application.privacy-policy') }}
        </a>
    </p>
</footer>
