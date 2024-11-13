<a
    class="
        bg-gray-50
        border
        border-gray-500
        dark:bg-gray-700
        dark:hover:border-gray-400
        dark:hover:bg-gray-600
        hover:bg-gray-200
        hover:border-gray-600
        px-2
        py-1
        rounded-full
        text-xs"
    href="{{ route('search', ['tag' => [$tag->id]]) }}"
>
    {{ __("tag.{$tag->title}") }}
</a>
