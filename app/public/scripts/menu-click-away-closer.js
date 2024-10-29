class MenuClickAwayCloser {
	/**
	 * The selector to find the menu(s) to close
	 * @type {string}
	 */
	menuQuerySelector = null;

	/**
	 * @param {string} menuQuerySelector The selector to find the menu(s) to close
	 */
	constructor(menuQuerySelector) {
		this.onClick = this.onClick.bind(this);
		this.menuQuerySelector = menuQuerySelector;
	}

	initialize() {
		document.addEventListener("click", this.onClick);
	}

	/**
	 * @param {Event} event The click event on the document
	 */
	onClick(event) {
		if (!event.target) {
			return;
		}
		const $menus = document.querySelectorAll(this.menuQuerySelector);
		for (const $menu of $menus) {
			const $eventMenu = event.target.closest(this.menuQuerySelector);
			const $eventSummary = event.target.closest("summary");
			if ($eventMenu !== $menu || !$eventSummary) {
				$menu.removeAttribute("open");
			}
		}
	}
}
