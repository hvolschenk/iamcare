<x-layouts.base>
    <x-slot:title>
        {{ __('item.edit') }}
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
                    "{{ App::currentLocale() }}",
                    "{{ config('google.places.region') }}",
                );
                googlePlacesAutocomplete.initialize();
            }
            createGooglePlacesAutocomplete();
            document.addEventListener('htmx:afterSwap', createGooglePlacesAutocomplete);
        </script>

        <script src="{{ asset('scripts/image-input-with-preview.js') }}"></script>
        <script nonce="{{ csp_nonce() }}" type="module">
            function createImageInput() {
                const $imageInputWithPreviewContainer = document.getElementById(
                    'image-input-with-preview__container',
                );
                const imageInputWithPreview = new ImageInputWithPreview(
                    $imageInputWithPreviewContainer,
                );
                imageInputWithPreview.initialize();
            }
            createImageInput();
            document.addEventListener('htmx:afterSwap', createImageInput);
        </script>
    </x-slot>

    <x-page-title
        :breadcrumbs="[
            ['title' => __('home.breadcrumb'), 'url' => route('home')],
            ['title' => __('me.breadcrumb'), 'url' => route('me')],
            ['title' => __('my-items.breadcrumb'), 'url' => route('myItems')],
            ['title' => $item->name, 'url' => route('item', $item)],
            ['title' => __('item.edit')],
        ]"
    >
        {{ __('item.edit') }}
    </x-page-title>

    <x-item-form
        actionPrimaryLabel="{{ __('item.edit') }}"
        actionPrimaryLocation="{{ route('itemEditHandler', $item) }}"
        :item="$item"
    />
</x-layouts.base>
