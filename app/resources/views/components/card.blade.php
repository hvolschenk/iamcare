<div
    {{
        $attributes
            ->class([
                'bg-neutral-50',
                'border',
                'border-neutral-300',
                'dark:bg-neutral-900',
                'dark:border-neutral-700',
                'dark:hover:bg-black',
                'dark:hover:border-neutral-700',
                'hover:bg-white',
                'hover:border-neutral-300',
                'p-4' => !isset($disablePadding) || $disablePadding === false,
                'rounded',
            ])
    }}
>
    {{ $slot }}
</div>
