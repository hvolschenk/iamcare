<x-chip
    {{ $attributes }}
    component="a"
    href="{{ route('search', ['tag' => [$tag->id]]) }}"
>
    {{ __("tag.{$tag->title}") }}{{ $slot }}
</x-chip>
