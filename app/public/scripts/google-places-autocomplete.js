class GooglePlacesAutocomplete {
	/**
	 * A session token to lower costs by grouping autocomplete calls
	 * of the same session.
	 * @type {google.maps.places.AutocompleteSessionToken}
	 */
	autocompleteSessionToken = null;

	/**
	 * The container for the autocomplete.
	 * The container must contain an `input[type="text"]` for the typeahead
	 * as well as an `input[type="hidden"]` for the Google Places PlaceID.
	 * @type {HTMLDivElement}
	 */
	$container = null;

	/**
	 * The "display" input is an `input[type="text"]`, used for the typeahead.
	 * It will be used to trigger a search, as well as be the anchor
	 * for the list of suggestions that come back from the API.
	 * @type {HTMLInputElement}
	 */
	$inputDisplay = null;

	/**
	 * The "value" input is an `input[type="hidden"]`
	 * used to save the Google Places PlaceID after a selection is made.
	 * @type {HTMLInputElement}
	 */
	$inputValue = null;

	/**
	 * The language to display suggestions and place details in
	 * @type {string}
	 */
	language = null;

	/**
	 * The ID of the timer for the debounced input.
	 * @type {number}
	 */
	onChangeTimer = null;

	/**
	 * The two letter country code to contain searches.
	 * @type {string}
	 */
	region = null;

	/**
	 * The selected Google Places Place.
	 * Will be used for resetting the input when focus is lost, etc.
	 * @type {google.maps.places.Place}
	 */
	selectedPlace = null;

	/**
	 * The container where the list of suggestions will be displayed.
	 * The only `<div />` inside the $container.
	 * @type {HTMLDivElement}
	 */
	$suggestionsContainer = null;

	/**
	 * @param {string} query
	 */
	async autocomplete(query) {
		this.clickAwayListenerCreate();
		if (!query) {
			this.suggestionsClear();
			return;
		}
		const { suggestions } =
			await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
				{
					includedPrimaryTypes: ["sublocality"],
					includedRegionCodes: [this.region],
					input: query,
					language: this.language,
					region: this.region,
				},
			);
		this.suggestionsClear();
		this.suggestionsRender(suggestions);
	}

	autocompleteSessionTokenGenerate() {
		this.autocompleteSessionToken =
			new google.maps.places.AutocompleteSessionToken();
	}

	/**
	 * @param {PointerEvent} event
	 */
	clickAwayListener(event) {
		if (
			!this.$inputDisplay.contains(event.target) &&
			!this.$suggestionsContainer.contains(event.target)
		) {
			this.reset();
			this.clickAwayListenerRemove();
		}
	}
	clickAwayListenerCreate() {
		document.addEventListener("click", this.clickAwayListener);
	}
	clickAwayListenerRemove() {
		document.removeEventListener("click", this.clickAwayListener);
	}

	/**
	 * @param {HTMLDivElement} $container The container for the autocomplete.
	 * @param {string} language The language to display suggestions and place details in
	 * @param {string} region The two letter country code to use to contain searches
	 */
	constructor($container, language, region) {
		// Because these functions are event handlers
		// they will have different contexts when executed.
		// Binding it back to this class here to be able to use `this` "normally".
		this.autocomplete = this.autocomplete.bind(this);
		this.clickAwayListener = this.clickAwayListener.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSuggestionSelect = this.onSuggestionSelect.bind(this);
		this.language = language;
		this.region = region;
		this.$container = $container;
		this.registerInputDisplay();
		this.registerInputValue();
		this.registerSuggestionsContainer();
		this.verifyGooglePlacesAPI();
	}

	/**
	 * Attaches all necessary events,
	 * and transforms the container into a Google Places Autocomplete element.
	 */
	initialize() {
		this.autocompleteSessionTokenGenerate();
		this.registerChangeEvent();
	}

	/**
	 * @param {Event} event The change event that was fired from typing
	 */
	onChange(event) {
		const autocomplete = this.autocomplete;
		clearTimeout(this.onChangeTimer);
		this.onChangeTimer = setTimeout(() => {
			autocomplete(event.target.value);
		}, 500);
	}

	/**
	 * @param {google.maps.places.Place} place
	 */
	async onSuggestionSelect(place) {
		this.suggestionsClear();
		this.clickAwayListenerRemove();
		this.autocompleteSessionTokenGenerate();
		await place.fetchFields({
			fields: ["formattedAddress", "id"],
		});
		this.$inputDisplay.value = place.formattedAddress;
		this.$inputValue.value = place.id;
		this.selectedPlace = place;
	}

	registerChangeEvent() {
		this.$inputDisplay.addEventListener("keydown", this.onChange);
	}

	/**
	 * Checks for the existence and validity of the `input[type="text"]`.
	 */
	registerInputDisplay() {
		const $inputDisplay = this.$container.querySelector('input[type="text"]');
		if (!$inputDisplay) {
			throw new Error(
				'The container must contain an `input[type="text"]` for the typeahead',
			);
		}
		this.$inputDisplay = $inputDisplay;
	}

	/**
	 * Checks for the existence and validity of the `input[type="hidden"]`.
	 */
	registerInputValue() {
		const $inputValue = this.$container.querySelector('input[type="hidden"]');
		if (!$inputValue) {
			throw new Error(
				'The container must contain an `input[type="hidden"]` to store the selected Google Places PlaceID',
			);
		}
		this.$inputValue = $inputValue;
	}

	/**
	 * Checks for the existence and validity of the [aria-role="list"].
	 */
	registerSuggestionsContainer() {
		const $suggestionsContainer =
			this.$container.querySelector('[aria-role="list"]');
		if (!$suggestionsContainer) {
			throw new Error(
				'The container must contain a suggestions container `[aria-role="list"]` to display the autocomplete suggestions',
			);
		}
		this.$suggestionsContainer = $suggestionsContainer;
	}

	/**
	 * Resets all components back to their pristine state.
	 * If a place is selected it will be used as the base value.
	 */
	reset() {
		this.suggestionsClear();
		if (this.selectedPlace) {
			this.$inputDisplay.value = this.selectedPlace.formattedAddress;
			this.$inputValue.value = this.selectedPlace.id;
		} else {
			this.$inputDisplay.value = "";
			this.$inputValue.value = "";
		}
	}

	suggestionsClear() {
		this.$suggestionsContainer.innerHTML = "";
	}

	/**
	 * @param {google.maps.places.AutocompleteSuggestion[]} suggestions
	 */
	suggestionsRender(suggestions) {
		for (const suggestion of suggestions) {
			const placePrediction = suggestion.placePrediction;
			const $suggestion = document.createElement("a");
			$suggestion.classList.add(
				"block",
				"cursor-pointer",
				"dark:hover:bg-neutral-600",
				"hover:bg-neutral-300",
				"p-4",
			);
			const onSuggestionSelect = this.onSuggestionSelect;
			$suggestion.addEventListener("click", () => {
				onSuggestionSelect(placePrediction.toPlace());
			});
			$suggestion.innerText = placePrediction.text.text;
			this.$suggestionsContainer.appendChild($suggestion);
		}
	}

	/**
	 * Verifies that the Google Places API has been loaded
	 */
	verifyGooglePlacesAPI() {
		if (!google.maps.places) {
			throw new Error(
				"The Google Places API must be loaded before using `GooglePlacesAutocomplete`",
			);
		}
	}
}
