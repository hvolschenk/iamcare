class ImageInputWithPreview {
	/**
	 * The container element containing all required elements
	 * @type {HTMLDivElement}
	 */
	$container = null;

	/**
	 * A list of existing images,
	 * specifically the container for each of them.
	 * Each container must contain:
	 *   * an `<img />`
	 *   * an `<input name="imageExisting[]" type="hidden" />`, and
	 *   * a `<button />` to remove the image.
	 * @type {HTMLDivElement[]}
	 */
	$existingImages = [];

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
		this.onExistingImageRemove = this.onExistingImageRemove.bind(this);
		this.onExistingImageRestore = this.onExistingImageRestore.bind(this);
		this.$container = $container;
		this.registerImageInput();
		this.registerPreviewContainer();
		this.registerExistingImages();
	}

	/**
	 * Binds all necessary events and prepares all elements
	 */
	initialize() {
		this.$imageInput.addEventListener("change", this.onChange);
		for (const $existingImage of this.$existingImages) {
			const $buttonRemove = $existingImage.querySelector(
				'button[type="button"]',
			);
			$buttonRemove.addEventListener("click", this.onExistingImageRemove);
		}
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

	/**
	 *
	 * @param {Event} event The click event on the remove button
	 */
	onExistingImageRemove(event) {
		let $buttonRemove = event.target;
		if ($buttonRemove instanceof Element) {
			if ($buttonRemove.tagName === "SPAN") {
				$buttonRemove = $buttonRemove.closest("button");
			}
			const $existingImageContainer = $buttonRemove.closest("div");
			const $existingImageInput = $existingImageContainer.querySelector(
				'input[type="hidden"]',
			);
			const $buttonRemoveIcon = $buttonRemove.querySelector("span");
			const $existingImage = $existingImageContainer.querySelector("img");
			$existingImageInput.setAttribute("disabled", true);
			$buttonRemove.removeEventListener("click", this.onExistingImageRemove);
			$buttonRemoveIcon.innerHTML = "restore_from_trash";
			$existingImage.classList.add("grayscale", "opacity-60");
			$buttonRemove.addEventListener("click", this.onExistingImageRestore);
		}
	}

	/**
	 *
	 * @param {Event} event The click event on the restore button
	 */
	onExistingImageRestore(event) {
		let $buttonRestore = event.target;
		if ($buttonRestore instanceof Element) {
			if ($buttonRestore.tagName === "SPAN") {
				$buttonRestore = $buttonRestore.closest("button");
			}
			const $existingImageContainer = $buttonRestore.closest("div");
			const $existingImageInput = $existingImageContainer.querySelector(
				'input[type="hidden"]',
			);
			const $buttonRestoreIcon = $buttonRestore.querySelector("span");
			const $existingImage = $existingImageContainer.querySelector("img");
			$existingImageInput.removeAttribute("disabled");
			$buttonRestore.removeEventListener("click", this.onExistingImageRestore);
			$buttonRestoreIcon.innerHTML = "clear";
			$existingImage.classList.remove("grayscale", "opacity-60");
			$buttonRestore.addEventListener("click", this.onExistingImageRemove);
		}
	}

	previewsClear() {
		const $previewImages =
			this.$previewContainer.querySelectorAll(".image-preview");
		for (const $previewImage of $previewImages) {
			$previewImage.remove();
		}
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
				"image-preview",
				"object-scale-down",
				"rounded",
			);
			this.$previewContainer.appendChild($previewImage);
		}
	}

	/**
	 * Registers the list of existing images
	 */
	registerExistingImages() {
		const $existingImages = this.$previewContainer.querySelectorAll("div");
		this.$existingImages = Array.from($existingImages);
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
