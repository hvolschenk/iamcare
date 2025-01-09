<a
    class="dark:hover:bg-neutral-700 flex flex-row gap-4 hover:bg-neutral-200 items-center p-2"
    href="#"
>
    <img
        alt="{{ $user->name }}"
        class="aspect-square border-2 border-primary dark:border-neutral-400 rounded-full size-7"
        referrerpolicy="no-referrer"
        src="{{ $user->avatar }}"
    />
    {{ $user->name }}
</a>
