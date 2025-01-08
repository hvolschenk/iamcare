<x-layouts.base>
    <x-slot:title>
        {{ $thread->item->name }}
    </x-slot>

    <h1 class="font-bold mb-10 text-5xl">
        {{ $thread->item->name }}
    </h1>

    <x-item-glance :item="$thread->item" />

    @if (Auth::user()->id === $thread->userGiver->id)
        <x-user-glance :user="$thread->userReceiver" />
    @else
        <x-user-glance :user="$thread->userGiver" />
    @endif

    <hr class="border-gray-500 lg:mx-24 md:mx-20 mx-4 my-8" />

    @include('pages.thread.messages', ['thread' => $thread])
</x-layouts.base>
