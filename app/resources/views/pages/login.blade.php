<x-layouts.base>
    <x-slot:title>
        Login
    </x-slot>

    <x-slot:scripts>
        <script async nonce="{{ csp_nonce() }}" src="https://accounts.google.com/gsi/client"></script>
    </x-slot>

    <h1 class="dark:text-gray-50 font-bold mb-10 text-5xl text-gray-800">
        {{ __('login.login') }}
    </h1>

    <div
        id="g_id_onload"
        data-auto_prompt="false"
        data-client_id="{{ config('google.identity.client_id') }}"
        data-context="signin"
        data-login_uri="{{ route('loginHandlerGoogle') }}"
        data-nonce="{{ csp_nonce() }}"
        data-use_fedcm_for_prompt="true"
        data-ux_mode="redirect"
    >
    </div>

    <div class="mx-auto w-96">
        @if (isset($error))
            <p class="bg-red-100 border border-red-600 dark:bg-red-900 dark:border-red-950 dark:text-red-100 mb-4 p-1 px-4 rounded text-red-600">
                {{ $error }}
            </p>
        @endif

        <div
            class="g_id_signin"
            data-logo_alignment="left"
            data-nonce="{{ csp_nonce() }}"
            data-shape="rectangular"
            data-size="large"
            data-theme="outline"
            data-text="signin_with"
            data-type="standard"
            data-width="384"
        >
        </div>

    </div>

</x-layouts.base>
