<span
    {{
        $attributes
            ->class([
                'absolute',
                'aspect-square',
                'bg-secondary',
                'flex',
                'items-center',
                'justify-center',
                'p-0',
                'right-0',
                'rounded-full',
                'size-3' => !isset($text),
                'size-5' => isset($text),
                'font-medium',
                'text-sm',
                'text-neutral-800',
                'top-0',
                'translate-x-2/4',
                '-translate-y-2/4',
            ])
    }}
>
    {{ $text ?? ' ' }}
</span>
