<a
    class="
        bg-neutral-50
        border
        border-neutral-500
        dark:bg-neutral-700
        dark:hover:border-neutral-400
        dark:hover:bg-neutral-600
        hover:bg-neutral-200
        hover:border-neutral-600
        px-2
        py-1
        rounded-full
        text-xs"
    href="{{ route('search', ['tag' => [$tag->id]]) }}"
>
    {{ __("tag.{$tag->title}") }}
</a>
