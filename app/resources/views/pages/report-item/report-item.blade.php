<x-layouts.base>
    <x-slot:title>
        {{ __('report-item.page-title') }}
    </x-slot>

    <x-page-title
        :breadcrumbs="[
            ['title' => __('home.breadcrumb'), 'url' => route('home')],
            ['title' => $item->name, 'url' => route('item', $item)],
            ['title' => __('report-item.page-title')],
        ]"
    >
        {{ __('report-item.page-title') }}
    </x-page-title>

    <x-item-glance :item="$item" />

    <x-card class="mt-4">
        @if ($itemReport === null)
            @include('pages.report-item.form')
        @else
            <p>{{ __('report-item.previously-reported') }}</p>
            <p class="font-mono mt-2">
                <em>{{ $itemReport->created_at->isoFormat('LLL') }}</em>: {{ $itemReport->reason }}
            </p>
        @endif
    </x-card>
</x-layouts.base>
