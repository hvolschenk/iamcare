class ImageInputWithPreview {
	/**
	 * The container element containing all required elements
	 * @type {HTMLDivElement}
	 */
	$container = null;

	/**
	 * The `input[type="image"]` input to render previews for
	 * @type {HTMLInputElement}
	 */
	$imageInput = null;

	/**
	 * The `div[aria-role="list"]` element serves as the container for all previews
	 * @type {HTMLDivElement}
	 */
	$previewContainer = null;

	/**
	 * @param {HTMLDivElement} $container
	 */
	constructor($container) {
		this.onChange = this.onChange.bind(this);
		this.$container = $container;
		this.registerImageInput();
		this.registerPreviewContainer();
	}

	/**
	 * Binds all necessary events and prepares all elements
	 */
	initialize() {
		this.$imageInput.addEventListener("change", this.onChange);
	}

	/**
	 * @param {Event} event The change event on the input element
	 */
	onChange(event) {
		if (event.target) {
			this.previewsClear();
			this.previewsRender(event.target.files || new FileList());
		}
	}

	previewsClear() {
		this.$previewContainer.innerHTML = "";
	}

	/**
	 * @param {File[]} files
	 */
	previewsRender(files) {
		for (const file of files) {
			const src = URL.createObjectURL(file);
			const $previewImage = document.createElement("img");
			$previewImage.setAttribute("alt", file.name);
			$previewImage.setAttribute("src", src);
			$previewImage.classList.add(
				"border",
				"border-gray-50",
				"dark:border-gray-500",
				"h-32",
				"object-scale-down",
				"rounded",
			);
			this.$previewContainer.appendChild($previewImage);
		}
	}

	/**
	 * Registers the `input[type="file"]` field as the image input
	 */
	registerImageInput() {
		const $imageInput = this.$container.querySelector('input[type="file"]');
		if (!$imageInput) {
			throw new Error(
				'The container must contain an `input[type="file"]` to render previews for',
			);
		}
		this.$imageInput = $imageInput;
	}

	/**
	 * Registers the `div[aria-role="list"]` element as the preview container
	 */
	registerPreviewContainer() {
		const $previewContainer = this.$container.querySelector(
			'div[aria-role="list"]',
		);
		if (!$previewContainer) {
			throw new Error(
				'The container must contain an `div[aria-role="list"]` to contain all previews',
			);
		}
		this.$previewContainer = $previewContainer;
	}
}
