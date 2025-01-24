@if (isset($breadcrumbs))
    <ul class="dark:text-neutral-200 flex flex-row gap-3 list-none mb-4 text-neutral-600">
        @foreach ($breadcrumbs as $breadcrumb)
            @if (!$loop->first)
                <span class="text-neutral-400">/</span>
            @endif
            <li>
                <a
                    @if (isset($breadcrumb['url']))
                        class="cursor-pointer hover:text-primary"
                        href="{{ $breadcrumb['url'] }}"
                    @endif
                >
                    {{ $breadcrumb['title'] }}
                </a>
            </li>
        @endforeach
    </ul>
@endif

<h1 class="font-bold mb-10 text-5xl">
    {{ $slot }}
</h1>
