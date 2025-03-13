<button
    {{
        $attributes
            ->class([
                'border-2',
                'border-primary',
                'dark:disabled:bg-neutral-500',
                'dark:disabled:text-neutral-200',
                'disabled:bg-neutral-200',
                'disabled:border-0',
                'disabled:text-neutral-500',
                'flex',
                'gap-2',
                'hover:bg-primary/20',
                'md:max-w-fit',
                'md:w-auto',
                'mt-4',
                'px-4',
                'py-2',
                'rounded-sm',
                'text-neutral-50',
                'w-full',
            ])
            ->merge(['type' => 'button'])
    }}
>
    {{ $slot }}
</button>
