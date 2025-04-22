<x-layouts.base>
    <x-slot:title>
        {{ $thread->item->name }}
    </x-slot>

    <x-page-title
        :breadcrumbs="[
            ['title' => __('home.breadcrumb'), 'url' => route('home')],
            ['title' => __('me.breadcrumb'), 'url' => route('me')],
            ['title' => __('threads.breadcrumb'), 'url' => route('threads')],
            ['title' => $thread->item->name],
        ]"
    >
        {{ $thread->item->name }}
    </x-page-title>

    <x-card class="mb-4">
        <x-item-glance :item="$thread->item" />

        @if (Auth::user()->id === $thread->userGiver->id)
            <x-user-glance :user="$thread->userReceiver" />
        @else
            <x-user-glance :user="$thread->userGiver" />
        @endif
    </x-card>

    <x-card>
        @include('pages.thread.messages', ['thread' => $thread])
    </x-card>
</x-layouts.base>
