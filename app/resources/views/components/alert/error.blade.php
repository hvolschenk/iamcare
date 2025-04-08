<div
    {{
        $attributes
            ->class([
                'bg-red-200',
                'dark:bg-red-950',
                'dark:text-red-200',
                'flex',
                'gap-3',
                'items-center',
                'px-4',
                'py-3',
                'rounded-lg',
                'text-red-950',
            ])
    }}
>
    <span class="material-symbols-outlined">error</span>
    {{ $slot }}
</div>
