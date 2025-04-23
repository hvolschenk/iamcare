<x-layouts.base>
    <x-slot:title>
        {{ __('search.page-title') }}
    </x-slot>

    <x-slot:scripts>
        <script @cspNonce>
            (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
                key: "{{ config('google.places.api_key') }}",
                v: "beta",
            });
        </script>
        <script src="{{ asset('scripts/google-places-autocomplete.js') }}"></script>
        <script @cspNonce>
            async function createGooglePlacesAutocomplete() {
                await google.maps.importLibrary("places");
                const $autocompleteContainer = document.getElementById(
                    "google-places__place-autocomplete__container",
                );
                const googlePlacesAutocomplete = new GooglePlacesAutocomplete(
                    $autocompleteContainer,
                    "{{ App::currentLocale() }}",
                    "{{ config('google.places.region') }}",
                );
                googlePlacesAutocomplete.initialize();
            }
            createGooglePlacesAutocomplete();
            document.addEventListener('htmx:afterSwap', createGooglePlacesAutocomplete);
        </script>
    </x-slot>

    <x-page-title
        :breadcrumbs="[
            ['title' => __('home.breadcrumb'), 'url' => route('home')],
            ['title' => __('search.breadcrumb')],
        ]"
    >
        @if (empty($query))
            {{ __('search.search-results-no-query') }}
        @else
            {{ __('search.search-results', ['query' => $query]) }}
        @endif
    </x-page-title>

    <details class="bg-neutral-50 border border-neutral-500 dark:bg-neutral-900 mb-4 rounded-sm">
        <summary class="cursor-pointer p-4">{{ __('search.advanced-search') }}</summary>
        <form action="{{ route('search') }}" class="mb-4 mx-6" method="GET">
            <div class="mb-4 w-full">
                <x-forms.label field="tag" for="tag" :label="__('search.field__query--label')" />
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
                    :helperText="__('search.field__query--helper-text')"
                />
            </div>

            <div class="mb-4 w-full">
                <x-forms.label field="tag" for="tag" :label="__('search.field__tag--label')" />
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
                    :helperText="__('search.field__tag--helper-text')"
                />
            </div>

            <div class="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div id="google-places__place-autocomplete__container">
                    <x-forms.label
                        field="location"
                        for="location-display"
                        :label="__('search.field__location--label')"
                    />
                    <div class="relative">
                        <input
                            autocomplete="off"
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
                        <div aria-role="list" class="absolute bg-neutral-200 border-primary dark:bg-neutral-700 w-full"></div>
                    </div>
                    <div class="mt-2">
                        <x-forms.helper-text
                            field="location"
                            :helperText="__('search.field__location--helper-text')"
                        />
                    </div>
                </div>

                <div>
                    <x-forms.label
                        field="distance"
                        for="distance"
                        :label="__('search.field__distance--label')"
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
                        :helperText="__('search.field__distance--helper-text')"
                    />
                </div>
            </div>

            <x-button type="submit">
                {{ __('search.action__search') }}
            </x-button>
        </form>
    </details>

    @if ($items->isEmpty())
        <x-alert>{{ __('search.no-results') }}</x-alert>
    @else
        <x-items-list :items="$items" />
    @endif

    <div class="flex flex-col flex-wrap gap-4 items-center justify-center mb-4 md:items-end mt-6">
        {{ $items->links() }}
    </div>
</x-layouts.base>
