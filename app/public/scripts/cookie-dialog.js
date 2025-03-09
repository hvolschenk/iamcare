(() => {
	/**
	 * @type {string} The name of the cookie
	 *   to remember whether cookies have been accepted :kappa:
	 */
	const COOKIE_NAME = "COOKIES_ACCEPTED";

	/**
	 * @type {HTMLDialogElement}
	 */
	const $cookieDialog = document.getElementById("cookie-dialog");

	/**
	 * @type {HTMLButtonElement}
	 */
	const $cookieDialogButtonAccept = document.getElementById(
		"cookie-dialog__button--accept",
	);

	/**
	 * @type {HTMLButtonElement}
	 */
	const $cookieDialogButtonDecline = document.getElementById(
		"cookie-dialog__button--decline",
	);

	function cookieDialogClose() {
		$cookieDialog.close();
	}

	function cookieDialogOpen() {
		const mustShowDialog = !["0", "1"].includes(
			document.cookie
				.split("; ")
				.find((cookie) => cookie.startsWith(`${COOKIE_NAME}=`))
				?.split("=")[1],
		);

		if (mustShowDialog) {
			$cookieDialog.showModal();
		}
	}

	function cookiesAccept() {
		gtag("consent", "update", {
			ad_storage: "granted",
			ad_user_data: "granted",
			ad_personalization: "granted",
			analytics_storage: "granted",
		});
		document.cookie = `${COOKIE_NAME}=1`;
		cookieDialogClose();
	}

	function cookiesDecline() {
		gtag("consent", "update", {
			ad_storage: "denied",
			ad_user_data: "denied",
			ad_personalization: "denied",
			analytics_storage: "denied",
		});
		document.cookie = `${COOKIE_NAME}=0`;
		cookieDialogClose();
	}

	$cookieDialogButtonAccept.addEventListener("click", cookiesAccept);
	$cookieDialogButtonDecline.addEventListener("click", cookiesDecline);

	cookieDialogOpen();
})();
