(() => {
	/**
	 * @type {HTMLDialogElement}
	 */
	const $searchDialog = document.getElementById("search-dialog");

	/**
	 * @type {HTMLButtonElement}
	 */
	const $searchDialogButton = document.getElementById("search-dialog__button");

	/**
	 * @param {Event} event The click event triggering this function call
	 */
	function searchDialogClose(event) {
		if (event.target === $searchDialog) {
			$searchDialog.close();
		}
	}

	function searchDialogOpen() {
		$searchDialog.showModal();
	}

	$searchDialog.addEventListener("click", searchDialogClose);
	$searchDialogButton.addEventListener("click", searchDialogOpen);
})();
