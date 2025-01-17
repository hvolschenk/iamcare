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
        helperText="{{ __('thread.messageHelperText') }}"
    />

    <x-button type="submit">
        <span class="material-symbols-outlined">send</span>
        {{ $actionPrimaryLabel }}
    </x-button>
</form>
