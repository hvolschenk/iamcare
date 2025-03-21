<form
    class="mt-6"
    hx-disabled-elt="button[type='submit']"
    hx-post="{{ route('reportUserHandler', $user) }}"
    hx-swap="outerHTML"
>
    @csrf

    <x-forms.label
        field="reason"
        for="reason"
        :label="__('report-user.reason__label')"
    />
    <textarea
        class="
            @error('reason')
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
        id="reason"
        name="reason"
        type="text"
    >{{ old('reason') }}</textarea>
    <x-forms.helper-text
        field="reason"
        :helperText="__('report-user.reason__helper-text')"
    />

    <x-button type="submit">
        <span class="material-symbols-outlined">flag</span>
        {{ __('report-user.action--report-user') }}
    </x-button>
</form>
