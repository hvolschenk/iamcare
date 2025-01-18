<div
    {{
        $attributes
            ->class([
                'bg-sky-200',
                'dark:bg-slate-950',
                'dark:text-sky-200',
                'flex',
                'gap-3',
                'items-center',
                'px-4',
                'py-3',
                'rounded-lg',
                'text-slate-950',
            ])
    }}
>
    <span class="material-symbols-outlined">info</span>
    {{ $slot }}
</div>
