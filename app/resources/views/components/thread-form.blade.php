@if ($item->is_given)
    <x-alert class="mb-4 mt-6">
        <div class="flex flex-row grow justify-between">
            <span>{{ __('thread.itemGiven') }}</span>
            @if ($item->user->id === Auth::user()->id)
                <form>
                    @csrf
                    <a
                        class="cursor-pointer hover:text-primary"
                        hx-confirm="{{ __('item.confirmUnmarkGiven') }}"
                        hx-disabled-elt="this"
                        hx-post="{{ route('itemUnmarkGiven', $item) }}"
                    >
                        {{ __('item.actionUnmarkGiven') }}
                    </a>
                </form>
            @endif
        </div>
    </x-alert>
@elseif ($item->trashed())
    <x-alert class="mb-4 mt-6">
        {{ __('thread.itemDeleted') }}
    </x-alert>
@else
    <form
        class="mt-4"
        hx-disabled-elt="button[type='submit']"
        hx-post="{{ $actionPrimaryLocation }}"
        hx-swap="{{ $swapStyle }}"
        hx-target="{{ $swapTarget ?? 'this' }}"
    >

        @csrf

        <x-forms.label field="message" for="message" label={{ __('thread.messageLabel') }} />
        <textarea
            class="
                @error('message')
                    border-red-600
                    dark:border-red-700
                @else
                    border-neutral-500
                @enderror
                border
                dark:bg-neutral-700
                focus:border-primary
                focus:outline
                focus:outline-primary
                mb-2
                mt-1
                p-2
                rounded
                w-full"
            id="message"
            name="message"
            type="text"
        >{{ old('message') }}</textarea>
        <x-forms.helper-text
            field="message"
            :helperText="__('thread.messageHelperText')"
        />

        <div class="flex flex-row gap-2">
            <x-button type="submit">
                <span class="material-symbols-outlined">send</span>
                {{ $actionPrimaryLabel }}
            </x-button>

            @if ($item->user->id === Auth::user()->id)
                <x-button.outlined
                    hx-confirm="{{ __('item.confirmMarkGiven') }}"
                    hx-disabled-elt="this"
                    hx-post="{{ route('itemMarkGiven', $item) }}"
                >
                    <span class="material-symbols-outlined">done_all</span>
                    {{ __('item.actionMarkGiven') }}
                </x-button.outlined>
            @endif
        </div>
    </form>
@endif
