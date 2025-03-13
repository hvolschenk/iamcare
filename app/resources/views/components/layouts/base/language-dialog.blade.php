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
    id="language-dialog"
>
    <ul class="list-none p-6">
        <li>
            <a
                class="flex gap-2 hover:bg-white/10 justify-between p-2 w-full"
                href="{{ route('language', 'af') }}"
            >
                Afrikaans
                @if (App::isLocale('af'))
                    <span class="material-symbols-outlined">check</span>
                @endif
            </a>
        </li>
        <li>
            <a
                class="flex gap-2 hover:bg-white/10 justify-between p-2 w-full"
                href="{{ route('language', 'en') }}"
            >
                English
                @if (App::isLocale('en'))
                    <span class="material-symbols-outlined">check</span>
                @endif
            </a>
        </li>
        <li>
            <a
                class="flex gap-2 hover:bg-white/10 justify-between p-2 w-full"
                href="{{ route('language', 'nl') }}"
            >
                Nederlands
                @if (App::isLocale('nl'))
                    <span class="material-symbols-outlined">check</span>
                @endif
            </a>
        </li>
    </ul>
</dialog>
