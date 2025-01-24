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

    <x-item-glance :item="$thread->item" />

    @if (Auth::user()->id === $thread->userGiver->id)
        <x-user-glance :user="$thread->userReceiver" />
    @else
        <x-user-glance :user="$thread->userGiver" />
    @endif

    <hr class="border-neutral-500 lg:mx-24 md:mx-20 mx-4 my-8" />

    @include('pages.thread.messages', ['thread' => $thread])
</x-layouts.base>
