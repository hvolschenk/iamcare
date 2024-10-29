<nav class="flex gap-2 items-center" role="navigation">
    <a
        class="
            bg-gray-200
            block
            dark:bg-gray-700
            dark:hover:bg-gray-600
            hover:bg-gray-300
            px-4
            py-2
            @if($paginator->onFirstPage())
                cursor-not-allowed
            @endif"
        @if(!$paginator->onFirstPage())
            href="{{ $paginator->previousPageUrl() }}"
        @endif
    >
        &lt;
    </a>

    @foreach ($elements as $element)
        {{-- Three dots (more) --}}
        @if (is_string($element))
            <a
                aria-disabled="true"
                class="
                    bg-gray-200
                    block
                    dark:bg-gray-700
                    dark:hover:bg-gray-600
                    hover:bg-gray-300
                    px-4
                    py-2
                    pointer-events-none"
            >
                {{ $element }}
            </a>
        @endif
        {{-- All numbers --}}
        @if (is_array($element))
            @foreach ($element as $page => $url)
                <a
                    aria-disabled="@if ($page === $paginator->currentPage()) true @else false @endif"
                    class="
                        bg-gray-200
                        block
                        dark:bg-gray-700
                        dark:hover:bg-gray-600
                        hover:bg-gray-300
                        px-4
                        py-2
                        @if ($page === $paginator->currentPage())
                            bg-gray-300
                            cursor-not-allowed
                            dark:bg-gray-600
                            font-medium
                        @endif"
                    @if ($page !== $paginator->currentPage())
                        href="{{ $url }}"
                    @endif
                >
                    {{ $page }}
                </a>
            @endforeach
        @endif
    @endforeach

    <a
        aria-disabled="@if($paginator->hasMorePages()) false @else true @endif"
        class="
            bg-gray-200
            block
            dark:bg-gray-700
            dark:hover:bg-gray-600
            hover:bg-gray-300
            px-4
            py-2
            @if(!$paginator->hasMorePages())
                cursor-not-allowed
            @endif"
        @if($paginator->hasMorePages())
            href="{{ $paginator->nextPageUrl() }}"
        @endif
    >
        &gt;
    </a>
</nav>
<p class="text-center">
    @if ($paginator->firstItem())
        {{ __('pagination.count', [
            'from' => $paginator->firstItem(),
            'to' => $paginator->lastItem(),
            'total' => $paginator->total(),
        ]) }}
    @else
        {{ __('pagination.countVague', [
            'count' => $paginator->count(),
            'total' => $paginator->total(),
        ]) }}
    @endif
</p>
