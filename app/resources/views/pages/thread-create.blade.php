<x-layouts.base>
    <x-slot:title>
        {{ __('thread.create') }}
    </x-slot>

    <h1 class="font-bold mb-10 text-5xl">
        {{ __('thread.create') }}
    </h1>

    <x-item-glance :item="$item" />
    <x-user-glance :user="$item->user" />

    <x-thread-form
        actionPrimaryLabel="{{ __('thread.actionSend') }}"
        actionPrimaryLocation="{{ route('threadCreateHandler', $item) }}"
        :item="$item"
    />
</x-layouts.base>
