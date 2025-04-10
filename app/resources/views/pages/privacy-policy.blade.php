<x-layouts.base>
    <x-slot:title>
        {{ __('privacy-policy.page-title') }}
    </x-slot>

    <x-page-title
        :breadcrumbs="[
            ['title' => __('home.breadcrumb'), 'url' => route('home')],
            ['title' => __('privacy-policy.breadcrumb')],
        ]"
    >
        {{ __('privacy-policy.page-title') }}
    </x-page-title>

    <div class="markdown">
        {!! $privacyPolicy !!}
    </div>
</x-layouts.base>
