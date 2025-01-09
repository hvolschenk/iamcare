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
                border-gray-500
            @enderror
            border
            dark:bg-gray-700
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

    <button
        class="
            bg-primary
            dark:disabled:bg-gray-500
            dark:disabled:text-gray-200
            disabled:bg-gray-200
            disabled:text-gray-500
            flex
            gap-2
            hover:bg-primary/80
            md:max-w-fit
            md:w-auto
            mt-4
            px-4
            py-2
            rounded
            text-gray-50
            w-full"
        type="submit"
    >
        <span class="material-symbols-outlined">send</span>
        {{ $actionPrimaryLabel }}
    </button>
</form>
