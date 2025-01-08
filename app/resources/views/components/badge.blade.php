<span class="
    absolute
    aspect-square
    bg-secondary
    flex
    items-center
    justify-center
    p-0
    right-0
    rounded-full
    @if (isset($text))
        size-5
    @else
        size-3
    @endif
    font-medium
    text-sm
    text-gray-800
    top-0
    translate-x-2/4
    -translate-y-2/4"
>
    {{ $text ?? ' ' }}
</span>
