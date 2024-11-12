class ImageCarousel {
	/**
	 * The currently selected image index
	 * @type {number}
	 */
	#activeIndex = 0;

	/**
	 * The button to go to the next image
	 * @type {HTMLElement}
	 */
	$buttonNext = null;

	/**
	 * The button to go to the previous image
	 * @type {HTMLElement}
	 */
	$buttonPrevious = null;

	/**
	 * The container that holds the carousel
	 * @type {HTMLDivElement}
	 */
	$container = null;

	/**
	 * The list of images to display
	 * @type {HTMLImageElement[]}
	 */
	$images = [];

	/**
	 * @param {HTMLDivElement} $container The container that holds the carousel
	 */
	constructor($container) {
		this.onClickNext = this.onClickNext.bind(this);
		this.onClickPrevious = this.onClickPrevious.bind(this);
		this.$container = $container;
	}

	get activeIndex() {
		return this.#activeIndex;
	}

	set activeIndex(value) {
		this.#activeIndex = value;
		this.displayActiveImage();
		this.updateButtonStatuses();
	}

	/**
	 * Hides all non-active images,
	 * and displays the active image.
	 */
	displayActiveImage() {
		for (const $image of this.$images) {
			$image.style.display = "none";
		}
		if (this.$images.length > 0) {
			this.$images[this.activeIndex].style.display = "inline-block";
		}
	}

	/**
	 * Attaches all the correct event listeners and starts the carousel
	 */
	initialize() {
		this.onClickNext = this.onClickNext.bind(this);
		this.registerImages();
		this.registerButtons();
		this.activeIndex = 0;
	}

	/**
	 * The handler for when the "next" button is clicked
	 */
	onClickNext() {
		if (this.activeIndex < this.$images.length - 1) {
			this.activeIndex += 1;
		}
	}

	/**
	 * The handler for when the "previous" button is clicked
	 */
	onClickPrevious() {
		if (this.activeIndex > 0) {
			this.activeIndex -= 1;
		}
	}

	/**
	 * Checks for the existence of the "next" button
	 */
	registerButtons() {
		const $buttons = this.$container.querySelectorAll("button");
		if ($buttons.length !== 2) {
			throw new Error(
				"Please provide exactly two <button>s inside the container; next and previous",
			);
		}
		this.$buttonPrevious = $buttons[0];
		this.$buttonPrevious.addEventListener("click", this.onClickPrevious);
		this.$buttonNext = $buttons[1];
		this.$buttonNext.addEventListener("click", this.onClickNext);
	}

	/**
	 * Register the list of images
	 */
	registerImages() {
		this.$images = this.$container.querySelectorAll("img");
	}

	/**
	 * Update the enabled/disabled status of the buttons
	 */
	updateButtonStatuses() {
		if (this.activeIndex === 0) {
			this.$buttonPrevious.setAttribute("disabled", true);
		} else {
			this.$buttonPrevious.removeAttribute("disabled");
		}

		if (this.activeIndex < this.$images.length - 1) {
			this.$buttonNext.removeAttribute("disabled");
		} else {
			this.$buttonNext.setAttribute("disabled", true);
		}
	}
}
