<div
    class="
        flex
        @if ($isSender)
            flex-row-reverse
        @else
            flex-row
        @endif
        gap-4"
>
    <div class="w-7">
        @if ($mustShowAvatar)
            <img
                alt="{{ $message->user->name }}"
                class="aspect-square border-2 border-primary dark:border-neutral-400 rounded-full size-7"
                src="{{ $message->user->getAvatar() }}"
            />
        @endif
    </div>
    <p
        class="
            @if ($isSender)
                bg-secondary/60
            @else
                bg-primary/60
            @endif
            flex
            px-2
            py-1
            rounded"
    >
        {{ $message->message }}
    </p>
</div>
