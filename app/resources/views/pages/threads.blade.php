<x-layouts.base>
    <x-slot:title>
        {{ __('threads.inbox') }}
    </x-slot>

    <h1 class="font-bold mb-10 text-5xl">
        {{ __('threads.inbox') }}
    </h1>

    @if ($threads->isEmpty())
        <p>{{ __('threads.error--no-items') }}</p>
    @else
        <ul class="dark:divide-neutral-700 divide-y divide-neutral-200 list-none">
            @foreach ($threads as $thread)
                <li class="dark:hover:bg-neutral-700 hover:bg-neutral-200">
                    <a
                        class="flex flex-row gap-4 items-center p-3"
                        href="{{ route('thread', $thread) }}"
                    >
                        <div class="relative">
                            <img
                                alt="{{ $thread->item->name }}"
                                class="aspect-square size-16"
                                src="{{ $thread->item->images[0]->get(64, 64) }}"
                            />
                            @if (!$thread->messages[count($thread->messages) - 1]->is_read)
                                <x-badge></x-badge>
                            @endif
                        </div>
                        <div
                            class="
                                @if ($thread->item->isGiven)
                                    line-through
                                @endif
                                flex
                                flex-col
                                flex-grow"
                            >
                            <h6 class="font-semibold">{{ $thread->item->name }}</h6>
                            <p class="dark:text-neutral-300 text-neutral-500">
                                @if (Auth::user()->id === $thread->userGiver->id)
                                    {{ $thread->userReceiver->name }}
                                @else
                                    {{ $thread->userGiver->name }}
                                @endif
                            </p>
                            <p class="truncate">
                                {{ $thread->messages[count($thread->messages) - 1]->message }}
                            </p>
                        </div>
                    </a>
                </li>
            @endforeach
        </ul>
    @endif

    <div class="flex flex-col flex-wrap gap-4 items-center justify-center mb-4 md:items-end mt-6">
        {{ $threads->links() }}
    </div>
</x-layouts.base>
