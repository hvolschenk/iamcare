(() => {
	/**
	 * @type {HTMLDialogElement}
	 */
	const $languageDialog = document.getElementById("language-dialog");

	/**
	 * @type {HTMLButtonElement}
	 */
	const $languageDialogButton = document.getElementById(
		"language-dialog__button",
	);

	/**
	 * @param {Event} event The click event triggering this function call
	 */
	function languageDialogClose(event) {
		if (event.target === $languageDialog) {
			$languageDialog.close();
		}
	}

	function languageDialogOpen() {
		$languageDialog.showModal();
	}

	$languageDialog.addEventListener("click", languageDialogClose);
	$languageDialogButton.addEventListener("click", languageDialogOpen);
})();
