<x-layouts.base>
    <x-slot:title>
        {{ __('privacy-policy.page-title') }}
    </x-slot>

    <x-page-title
        :breadcrumbs="[
            ['title' => __('home.breadcrumb'), 'url' => route('home')],
            ['title' => __('legal.breadcrumb'), 'url' => route('legal')],
            ['title' => __('privacy-policy.breadcrumb')],
        ]"
    >
        {{ __('privacy-policy.page-title') }}
    </x-page-title>

    <x-card>
        <div class="markdown">
            {!! $privacyPolicy !!}
        </div>
    </x-card>
</x-layouts.base>
