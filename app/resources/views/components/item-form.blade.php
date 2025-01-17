<form
    enctype="multipart/form-data"
    hx-disabled-elt="button[type='submit']"
    hx-encoding="multipart/form-data"
    hx-post="{{ $actionPrimaryLocation }}"
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
                border-neutral-500
            @enderror
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
        id="name"
        name="name"
        value="{{ old('name', $item?->name ?? '') }}"
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
                border-neutral-500
            @enderror
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
        id="description"
        name="description"
        type="text"
    >{{ old('description', $item?->description ?? '') }}</textarea>
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
                border-neutral-500
            @enderror
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
                @selected(
                    collect([
                        ...old('tag', []),
                        ...collect($item?->tags ?? [])->map(fn($t) => $t->id),
                    ])->contains($tag->id)
                )
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
                        border-neutral-500
                    @enderror
                    border
                    dark:bg-neutral-700
                    focus:border-primary
                    focus:outline
                    focus:outline-primary
                    mt-1
                    p-2
                    rounded
                    w-full"
                id="location-display"
                name="location-display"
                value="{{ old('location-display', $item?->location->address ?? '') }}"
                type="text"
            />
            <input name="location" type="hidden" value="{{ old('location', $item?->location->googlePlaceID ?? '') }}" />
            <div aria-role="list" class="absolute border-primary dark:bg-neutral-700 w-full"></div>
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
                file:dark:bg-neutral-700
                @error('image')
                    file:dark:border-red-700
                @else
                    file:dark:border-neutral-500
                @enderror
                file:dark:border-solid
                file:dark:hover:bg-neutral-600
                file:dark:text-neutral-50
                file:hover:bg-primary/90
                file:text-neutral-50
                mt-2
                text-sm
                w-full"
            id="image"
            multiple
            name="image[]"
            type="file"
        />
        <div aria-role="list" class="flex flex-row flex-wrap gap-2 my-4">
            @foreach ($item?->images ?? [] as $image)
                <div class="relative">
                    <input name="imageExisting[]" type="hidden" value="{{ $image->id }}" />
                    <img
                        class="
                            border
                            border-neutral-50
                            dark:border-neutral-500
                            h-32
                            object-scale-down
                            rounded"
                        src="{{ $image->get(300, 300) }}"
                    />
                    <button
                        class="absolute aspect-square bg-black/30 flex hover:bg-black/50 p-1 right-1 rounded-full top-1"
                        type="button"
                    >
                        <span class="!leading-none material-symbols-outlined text-neutral-50 !text-lg">
                            close
                        </span>
                    </button>
                </div>
            @endforeach
        </div>
        <x-forms.helper-text
            field="image"
            helperText="{{ __('item.imagesHelperText') }}"
        />
    </div>

    <x-button type="submit">
        {{ $actionPrimaryLabel }}
    </x-button>
</form>
