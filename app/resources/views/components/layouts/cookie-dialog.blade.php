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
    id="cookie-dialog"
>
    <div class="p-6">
        <h6 class="font-bold mb-2 text-lg">
            {{ __('application.cookies-dialog__title') }}
        </h6>
        <p class="mb-2">{{ __('application.cookies-dialog__description') }}</p>
        <div class="flex flex-row gap-2 justify-end">
            <x-button.outlined id="cookie-dialog__button--decline">
                {{ __('application.cookies-dialog__action--decline') }}
            </x-button.outlined>
            <x-button autofocus id="cookie-dialog__button--accept">
                {{ __('application.cookies-dialog__action--accept') }}
            </x-button>
        </div>
    </div>
</dialog>
