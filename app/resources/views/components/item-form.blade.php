<form
    enctype="multipart/form-data"
    hx-disabled-elt="button[type='submit']"
    hx-encoding="multipart/form-data"
    hx-post="{{ route('itemGive') }}"
    hx-swap="outerHTML"
>
    @csrf

    @if (isset($error))
        <p class="bg-red-100 border border-red-600 dark:bg-red-900 dark:border-red-950 dark:text-red-100 mb-4 p-1 px-4 rounded text-red-600">
            {{ $error }}
        </p>
    @endif

    <x-forms.label field="name" for="name" label="{{ __('item.nameLabel') }}" />
    <input
        class="
            @error('name')
                border-red-600
                dark:border-red-700
            @else
                border-gray-500
            @enderror
            border
            dark:bg-gray-700
            focus:border-primary
            focus:outline
            focus:outline-primary
            mb-2
            mt-1
            p-2
            rounded
            w-full"
        id="name"
        name="name"
        value="{{ old('name') }}"
        type="text"
    />
    <x-forms.helper-text
        field="name"
        helperText="{{ __('item.nameHelperText') }}"
    />

    <x-forms.label field="description" for="description" label="{{ __('item.descriptionLabel') }}" />
    <textarea
        class="
            @error('description')
                border-red-600
                dark:border-red-700
            @else
                border-gray-500
            @enderror
            border
            dark:bg-gray-700
            focus:border-primary
            focus:outline
            focus:outline-primary
            mb-2
            mt-1
            p-2
            rounded
            w-full"
        id="description"
        name="description"
        type="text"
    >{{ old('description') }}</textarea>
    <x-forms.helper-text
        field="description"
        helperText="{{ __('item.descriptionHelperText') }}"
    />

    <x-forms.label field="tag" for="tag" label="{{ __('item.tagsLabel') }}" />
    <select
        class="
            @error('tag')
                border-red-600
                dark:border-red-700
            @else
                border-gray-500
            @enderror
            border
            border-gray-500
            dark:bg-gray-700
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
                @selected(collect(old('tag'))->contains($tag->id))
                value="{{ $tag->id }}"
            >
                {{__("tag.{$tag->title}")}}
            </option>
        @endforeach
    </select>
    <x-forms.helper-text
        field="tag"
        helperText="{{ __('item.tagsHelperText') }}"
    />

    <div id="google-places__place-autocomplete__container">
        <x-forms.label field="location" for="location-display" label="{{ __('item.locationLabel') }}" />
        <div>
            <input
                class="
                    @error('location')
                        border-red-600
                        dark:border-red-700
                    @else
                        border-gray-500
                    @enderror
                    border
                    dark:bg-gray-700
                    focus:border-primary
                    focus:outline
                    focus:outline-primary
                    mt-1
                    p-2
                    rounded
                    w-full"
                id="location-display"
                name="location-display"
                value="{{ old('location-display') }}"
                type="text"
            />
            <input name="location" type="hidden" value="{{ old('location') }}" />
            <div aria-role="list" class="absolute border-primary dark:bg-gray-700 w-full"></div>
        </div>
        <div class="mt-2">
            <x-forms.helper-text
                field="location"
                helperText="{{ __('item.locationHelperText') }}"
            />
        </div>
    </div>

    <div id="image-input-with-preview__container">
        <x-forms.label field="image" for="image" label="{{ __('item.imagesLabel') }}" />
        <input
            accept="image/*"
            class="
                block
                file:bg-primary
                file:border-0
                file:cursor-pointer
                file:mr-4
                file:px-4
                file:py-2
                file:rounded
                file:dark:border
                file:dark:bg-gray-700
                @error('image')
                    file:dark:border-red-700
                @else
                    file:dark:border-gray-500
                @enderror
                file:dark:border-solid
                file:dark:hover:bg-gray-600
                file:dark:text-gray-50
                file:hover:bg-primary/90
                file:text-gray-50
                mb-4
                mt-2
                text-sm
                w-full"
            id="image"
            multiple
            name="image[]"
            type="file"
        />
        <div aria-role="list" class="flex flex-row flex-wrap gap-2 mb-4"></div>
        <x-forms.helper-text
            field="image"
            helperText="{{ __('item.imagesHelperText') }}"
        />
    </div>

    <button
        class="
            bg-primary
            dark:disabled:bg-gray-500
            dark:disabled:text-gray-200
            disabled:bg-gray-200
            disabled:text-gray-500
            hover:bg-primary/80
            md:w-auto
            px-4
            py-2
            rounded
            text-gray-50
            w-full"
        type="submit"
    >
        {{ __('item.give') }}
    </button>
</form>
