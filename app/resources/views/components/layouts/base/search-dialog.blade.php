<dialog
    class="
        backdrop:backdrop-blur-xs
        backdrop:bg-neutral-500/10
        dark:backdrop:bg-neutral-100/10
        bg-neutral-100
        border
        border-neutral-500
        dark:bg-neutral-800
        dark:text-neutral-50
        mx-6
        md:mx-auto
        md:w-96
        rounded
        text-neutral-800
        w-full"
    id="search-dialog"
>
    <search>
        <form action="{{ route('search') }}" class="p-6" method="GET">
            <x-forms.label field="query" for="query" :label="__('search.field__query--label')" />
            <input
                autofocus
                class="
                    border-neutral-500
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
                id="query"
                name="query"
                type="text"
            />
            <x-forms.helper-text
                field="query"
                :helperText="__('search.field__query--helper-text')"
            />

            <div class="flex justify-end">
                <x-button type="submit">
                    {{ __('search.action__search') }}
                </x-button>
            </div>
        </form>
    </search>
</dialog>
