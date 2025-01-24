<x-layouts.base>
    <x-slot:title>
        {{ __('thread.create') }}
    </x-slot>

    <x-page-title
        :breadcrumbs="[
            ['title' => __('home.breadcrumb'), 'url' => route('home')],
            ['title' => $item->name, 'url' => route('item', $item)],
            ['title' => __('thread.create-breadcrumb')]
        ]"
    >
        {{ __('thread.create') }}
    </x-page-title>

    <x-item-glance :item="$item" />
    <x-user-glance :user="$item->user" />

    <x-thread-form
        actionPrimaryLabel="{{ __('thread.actionSend') }}"
        actionPrimaryLocation="{{ route('threadCreateHandler', $item) }}"
        :item="$item"
        swapStyle="outerHTML"
    />
</x-layouts.base>
