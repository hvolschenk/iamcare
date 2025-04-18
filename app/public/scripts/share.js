class Share {
	/**
	 * The button to invoke the share.
	 * @type {HtmlElement}
	 */
	$buttonShare = null;

	/**
	 * The data to potentially be shared.
	 * @type {ShareData}
	 */
	shareData = {};

	/**
	 * @param {HtmlElement} $buttonShare The button to invoke the share.
	 * @param {ShareData} shareData The data to potentially be shared.
	 * @returns {void}
	 */
	constructor($buttonShare, shareData) {
		this.onClickShare = this.onClickShare.bind(this);
		this.$buttonShare = $buttonShare;
		this.shareData = shareData;
	}

	/**
	 * @returns {boolean} Whether sharing is available on this device/browser.
	 */
	canShare() {
		if (!("canShare" in navigator)) {
			return false;
		}
		if (!navigator.canShare(this.shareData)) {
			return false;
		}
		return true;
	}

	/**
	 * Set up the button and necessary event listeners.
	 */
	initialize() {
		this.updateButtonState();
		this.registerButton();
	}

	/**
	 * Invoked when the share button is clicked.
	 */
	onClickShare() {
		navigator.share(this.shareData);
	}

	/**
	 * Sets up the necessary event listeners on the button.
	 */
	registerButton() {
		if (this.canShare()) {
			this.$buttonShare.addEventListener("click", this.onClickShare);
		}
	}

	/**
	 * Update the state (enabled/disabled) of the button
	 * based on whether sharing is available for the device/browser.
	 */
	updateButtonState() {
		if (this.canShare()) {
			this.$buttonShare.removeAttribute("disabled");
		} else {
			this.$buttonShare.setAttribute("disabled", true);
		}
	}
}
