<div id="thread__messages">
    <div class="flex flex-col gap-2">
        @foreach ($thread->messages as $messageIndex => $message)
            <x-thread-message
                :isSender="Auth::user()->id === $message->user->id"
                :message="$message"
                :mustShowAvatar="$messageIndex === 0 || $thread->messages[$messageIndex - 1]->user->id !== $message->user->id"
            />
        @endforeach
    </div>

    <x-thread-form
        actionPrimaryLabel="{{ __('thread.actionSend') }}"
        actionPrimaryLocation="{{ route('threadReply', $thread) }}"
        :item="$thread->item"
        swapStyle="outerHTML"
        swapTarget="#thread__messages"
    />
</div>
