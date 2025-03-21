<x-layouts.base>
    <x-slot:title>
        {{ __('report-user.page-title') }}
    </x-slot>

    <x-page-title
        :breadcrumbs="[
            ['title' => __('home.breadcrumb'), 'url' => route('home')],
            ['title' => $user->name, 'url' => route('user', $user)],
            ['title' => __('report-user.page-title')],
        ]"
    >
        {{ __('report-user.page-title') }}
    </x-page-title>

    <x-user-glance :user="$user" />

    <div class="mt-6">
        @if ($userReport === null)
            @include('pages.report-user.form')
        @else
            <p>{{ __('report-user.previously-reported') }}</p>
            <p class="font-mono mt-2">
                <em>{{ $userReport->created_at->isoFormat('LLL') }}</em>: {{ $userReport->reason }}
            </p>
        @endif
    </div>
</x-layouts.base>
