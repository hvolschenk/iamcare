<x-chip
    {{ $attributes }}
    href="{{ route('search', ['tag' => [$tag->id]]) }}"
>
    {{ __("tag.{$tag->title}") }}{{ $slot }}
</x-chip>
