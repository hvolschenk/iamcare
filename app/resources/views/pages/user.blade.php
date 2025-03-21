<x-layouts.base>
    <x-slot:title>
        {{ $user->name }}
    </x-slot>

    <x-page-title
        :breadcrumbs="[
            ['title' => __('home.breadcrumb'), 'url' => route('home')],
            ['title' => $user->name],
        ]"
    >
        <div class="flex flex-row justify-between">
            <span>{{ $user->name }}</span>
            @if (Auth::user()->id !== $user->id)
                <a
                    class="
                        @if ($userReport === null)
                            dark:text-neutral-400
                            dark:hover:text-secondary
                            text-primary
                            hover:text-secondary
                        @else
                            dark:text-secondary
                            text-secondary
                        @endif
                        flex
                        items-center"
                    href="{{ route('reportUser', $user) }}"
                >
                    <span class="material-symbols-outlined">flag</span>
                </a>
            @endif
        </div>
    </x-page-title>

    @if (count($user->items) > 0)
        <x-items-list :items="$user->items" />
    @else
        <x-alert class="mb-4 mt-6">
            {{ __('user.no-items') }}
        </x-alert>
    @endif
</x-layouts.base>
