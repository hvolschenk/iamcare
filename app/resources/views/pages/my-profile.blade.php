<x-layouts.base>
    <x-slot:title>
        {{ __('my-profile.page-title') }}
    </x-slot>

    <x-page-title
        :breadcrumbs="[
            ['title' => __('home.breadcrumb'), 'url' => route('home')],
            ['title' => __('me.breadcrumb'), 'url' => route('me')],
            ['title' => __('my-profile.breadcrumb')],
        ]"
    >
        {{ __('my-profile.page-title') }}
    </x-page-title>

    @if (isset($error))
        @if ($error === 'userExists')
            <x-alert.error class="mb-4">
                <div class="flex flex-row grow justify-between">
                    <span>{{ __('my-profile.error__user-exists__description') }}</span>
                    <a href="https://github.com/hvolschenk/iamcare/issues" target="_blank">
                        {{ __('my-profile.error__user-exists__action--open-issue') }}
                    </a>
                </div>
            </x-alert.error>
        @endif
    @endif

    <x-card>
        <ul
            class="dark:divide-neutral-700 divide-y divide-neutral-200 list-none"
            hx-disabled-elt=".authentication-method__set-default"
        >
            @if (isset($google))
                <li class="dark:hover:bg-neutral-700 flex gap-4 hover:bg-neutral-200 items-center px-2 py-2">
                    <form>
                        @csrf
                        <a
                            class="authentication-method__set-default cursor-pointer flex"
                            hx-post="{{ route('authenticationMethodSetDefault', $google) }}"
                        >
                            <span
                                class="
                                    dark:text-neutral-400
                                    dark:hover:text-secondary
                                    hover:text-secondary
                                    text-primary
                                    @if ($google->is_primary)
                                        dark:text-secondary
                                        text-secondary
                                    @endif
                                    material-symbols-outlined"
                            >
                                star
                            </span>
                        </a>
                    </form>
                    <img
                        alt="{{ __('login.provider--google') }}"
                        class="size-4"
                        height="16"
                        src="{{ asset('images/social/google.webp') }}"
                        width="16"
                    />
                    <img
                        alt="{{ $google->name }}"
                        class="aspect-square border border-primary dark:border-neutral-400 hover:border-secondary rounded-full size-7"
                        height="28"
                        referrerpolicy="no-referrer"
                        src="{{ $google->getAvatar() }}"
                        width="28"
                    />
                    <div class="flex flex-col">
                        <span>{{ $google->name }}</span>
                        <span class="dark:text-neutral-300 text-neutral-500">
                            {{ $google->email }}
                        </span>
                    </div>
                </li>
            @endif

            @if (isset($microsoft))
                <li class="dark:hover:bg-neutral-700 flex gap-4 hover:bg-neutral-200 items-center px-2 py-2">
                    <form>
                        @csrf
                        <a
                            class="authentication-method__set-default cursor-pointer flex"
                            hx-post="{{ route('authenticationMethodSetDefault', $microsoft) }}"
                        >
                            <span
                                class="
                                    dark:text-neutral-400
                                    dark:hover:text-secondary
                                    hover:text-secondary
                                    text-primary
                                    @if ($microsoft->is_primary)
                                        dark:text-secondary
                                        text-secondary
                                    @endif
                                    material-symbols-outlined"
                            >
                                star
                            </span>
                        </a>
                    </form>
                    <img
                        alt="{{ __('login.provider--microsoft') }}"
                        class="size-4"
                        height="16"
                        src="{{ asset('images/social/microsoft.png') }}"
                        width="16"
                    />
                    <img
                        alt="{{ $microsoft->name }}"
                        class="aspect-square border border-primary dark:border-neutral-400 hover:border-secondary rounded-full size-7"
                        height="28"
                        referrerpolicy="no-referrer"
                        src="{{ $microsoft->getAvatar() }}"
                        width="28"
                    />
                    <div class="flex flex-col">
                        <span>{{ $microsoft->name }}</span>
                        <span class="dark:text-neutral-300 text-neutral-500">
                            {{ $microsoft->email }}
                        </span>
                    </div>
                </li>
            @endif

            @if (!isset($google))
                <li class="dark:hover:bg-neutral-700 hover:bg-neutral-200">
                    <a
                        class="flex gap-4 items-center px-2 py-2"
                        href="{{ route('loginRedirect', ['driver' => 'google']) }}"
                    >
                        <div class="authentication-method__set-default cursor-pointer flex">
                            <span
                                class="
                                    dark:text-neutral-400
                                    dark:hover:text-secondary
                                    hover:text-secondary
                                    text-primary
                                    material-symbols-outlined"
                            >
                                add
                            </span>
                        </div>
                        <img
                            alt="{{ __('login.provider--google') }}"
                            class="size-4"
                            height="16"
                            src="{{ asset('images/social/google.webp') }}"
                            width="16"
                        />
                        {{ __('my-profile.link-account--google') }}
                    </a>
                </li>
            @endif

            @if (!isset($microsoft))
                <li class="dark:hover:bg-neutral-700 hover:bg-neutral-200">
                    <a
                        class="flex gap-4 items-center px-2 py-2"
                        href="{{ route('loginRedirect', ['driver' => 'microsoft']) }}"
                    >
                        <div class="authentication-method__set-default cursor-pointer flex">
                            <span
                                class="
                                    dark:text-neutral-400
                                    dark:hover:text-secondary
                                    hover:text-secondary
                                    text-primary
                                    material-symbols-outlined"
                            >
                                add
                            </span>
                        </div>
                        <img
                            alt="{{ __('login.provider--microsoft') }}"
                            class="size-4"
                            height="16"
                            src="{{ asset('images/social/microsoft.png') }}"
                            width="16"
                        />
                        {{ __('my-profile.link-account--microsoft') }}
                    </a>
                </li>
            @endif
        </ul>
    </x-card>
</x-layouts.base>
