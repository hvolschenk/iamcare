<x-layouts.base>
    <x-slot:title>
        {{ __('terms-of-use.page-title') }}
    </x-slot>

    <x-page-title
        :breadcrumbs="[
            ['title' => __('home.breadcrumb'), 'url' => route('home')],
            ['title' => __('terms-of-use.breadcrumb')],
        ]"
    >
        {{ __('terms-of-use.page-title') }}
    </x-page-title>

    <div class="markdown">
        {!! $termsOfUse !!}
    </div>
</x-layouts.base>
