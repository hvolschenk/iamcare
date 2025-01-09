<x-layouts.base>
    <x-slot:title>
        {{ __('search.page-title') }}
    </x-slot>

    <x-slot:scripts>
        <script nonce="{{ csp_nonce() }}">
            (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
                key: "{{ config('google.places.api_key') }}",
                v: "beta",
            });
        </script>
        <script src="{{ asset('scripts/google-places-autocomplete.js') }}"></script>
        <script nonce="{{ csp_nonce() }}">
            async function createGooglePlacesAutocomplete() {
                await google.maps.importLibrary("places");
                const $autocompleteContainer = document.getElementById(
                    "google-places__place-autocomplete__container",
                );
                const googlePlacesAutocomplete = new GooglePlacesAutocomplete(
                    $autocompleteContainer,
                    "{{ config('google.places.region') }}",
                );
                googlePlacesAutocomplete.initialize();
            }
            createGooglePlacesAutocomplete();
            document.addEventListener('htmx:afterSwap', createGooglePlacesAutocomplete);
        </script>
    </x-slot>

    <h1 class="font-bold mb-10 text-5xl">
        @if (empty($query))
            {{ __('search.search-results-no-query') }}
        @else
            {{ __('search.search-results', ['query' => $query]) }}
        @endif
    </h1>

    <details class="bg-neutral-50 border border-neutral-500 dark:bg-neutral-900 mb-4 rounded">
        <summary class="cursor-pointer p-4">{{ __('search.advanced-search') }}</summary>
        <form action="{{ route('search') }}" class="mb-4 mx-6" method="GET">
            <div class="mb-4 w-full">
                <x-forms.label field="tag" for="tag" label="{{ __('search.field__query--label') }}" />
                <input
                    class="
                        border-neutral-500
                        border
                        dark:bg-neutral-700
                        focus:border-primary
                        focus:outline
                        focus:outline-primary
                        mb-2
                        mt-1
                        p-2
                        rounded
                        w-full"
                    name="query"
                    type="text"
                    value="{{ $query }}"
                />
                <x-forms.helper-text
                    field="query"
                    helperText="{{ __('search.field__query--helper-text') }}"
                />
            </div>

            <div class="mb-4 w-full">
                <x-forms.label field="tag" for="tag" label="{{ __('search.field__tag--label') }}" />
                <select
                    class="
                        border
                        border-neutral-500
                        dark:bg-neutral-700
                        focus:border-primary
                        focus:outline
                        focus:outline-primary
                        mb-2
                        mt-1
                        p-2
                        rounded
                        w-full"
                    id="tag"
                    multiple
                    name="tag[]"
                >
                    @foreach ($tags as $tag)
                        <option
                            @selected(collect($tagIDs)->contains($tag->id))
                            value="{{ $tag->id }}"
                        >
                            {{ __("tag.{$tag->title}") }}
                        </option>
                    @endforeach
                </select>
                <x-forms.helper-text
                    field="tag"
                    helperText="{{ __('search.field__tag--helper-text') }}"
                />
            </div>

            <div class="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div id="google-places__place-autocomplete__container">
                    <x-forms.label
                        field="location"
                        for="location-display"
                        label="{{ __('search.field__location--label') }}"
                    />
                    <div>
                        <input
                            class="
                                border
                                border-neutral-500
                                dark:bg-neutral-700
                                focus:border-primary
                                focus:outline
                                focus:outline-primary
                                mt-1
                                p-2
                                rounded
                                w-full"
                            id="location-display"
                            value="{{ $locationName }}"
                            type="text"
                        />
                        <input name="location" type="hidden" value="{{ $googlePlaceID }}" />
                        <div aria-role="list" class="absolute border-primary dark:bg-neutral-700 w-full"></div>
                    </div>
                    <div class="mt-2">
                        <x-forms.helper-text
                            field="location"
                            helperText="{{ __('search.field__location--helper-text') }}"
                        />
                    </div>
                </div>

                <div>
                    <x-forms.label
                        field="distance"
                        for="distance"
                        label="{{ __('search.field__distance--label') }}"
                    />
                    <select
                        class="
                            border
                            border-neutral-500
                            dark:bg-neutral-700
                            focus:border-primary
                            focus:outline
                            focus:outline-primary
                            mb-2
                            mt-1
                            p-2
                            rounded
                            w-full"
                        id="distance"
                        name="distance"
                    >
                        <option @selected($distance === '') value=""> - </option>
                        <option @selected($distance === '10') value="10">10 km</option>
                        <option @selected($distance === '20') value="20">20 km</option>
                        <option @selected($distance === '50') value="50">50 km</option>
                        <option @selected($distance === '100') value="100">100 km</option>
                    </select>
                    <x-forms.helper-text
                        field="tag"
                        helperText="{{ __('search.field__distance--helper-text') }}"
                    />
                </div>
            </div>

            <button
                class="
                    bg-primary
                    dark:disabled:bg-neutral-500
                    dark:disabled:text-neutral-200
                    disabled:bg-neutral-200
                    disabled:text-neutral-500
                    hover:bg-primary/80
                    md:w-auto
                    px-4
                    py-2
                    rounded
                    text-neutral-50
                    w-full"
                type="submit"
            >
                {{ __('search.action__search') }}
            </button>
        </form>
    </details>

    @if ($items->isEmpty())
        <p>{{ __('search.no-results') }}</p>
    @else
        <ul class="gap-4 grid grid-cols-1 lg:grid-cols-4 list-none md:grid-cols-3">
            @foreach ($items as $item)
                <li
                    class="
                        bg-neutral-50
                        border
                        border-neutral-500
                        dark:bg-neutral-900
                        dark:hover:bg-black
                        dark:hover:border-neutral-400
                        hover:bg-white
                        hover:border-neutral-600
                        rounded"
                >
                    <a href="{{ route('item', $item) }}">
                        <img
                            class="aspect-square w-full"
                            src="{{ $item->images[0]->get(300, 300) }}"
                        />
                    </a>
                    <div class="p-4">
                        <a href="{{ route('item', $item) }}">
                            <p class="font-bold truncate">{{ $item->name }}</p>
                        </a>
                        <a
                            class="dark:text-neutral-300 hover:underline text-neutral-500"
                            href="{{ route(
                                'search',
                                ['distance' => '20', 'location' => $item->location->googlePlaceID],
                            ) }}"
                        >
                            {{ $item->location->name }}
                        </a>
                        <p class="mt-2 truncate">{{ $item->description }}</p>
                        <p class="flex gap-1 mt-2 overflow-x-hidden pb-1 whitespace-nowrap">
                            @foreach ($item->tags as $tag)
                                <x-tag :tag="$tag" />
                            @endforeach
                        </p>
                    </div>
                </li>
            @endforeach
        </ul>
    @endif

    <div class="flex flex-col flex-wrap gap-4 items-center justify-center mb-4 md:items-end mt-6">
        {{ $items->links() }}
    </div>
</x-layouts.base>
