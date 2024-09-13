htmx.defineExtension('reset-after-submit', {
    onEvent: function(name, event) {
        console.log('reset-after-submit', { name, event });
        if (name !== 'htmx:beforeSwap') {
            return;
        }
        if (event.detail.isError) {
            return;
        }

        const $element = event.detail.requestConfig.elt;
        if (!$element.closest('[hx-reset-after-submit]') && !$element.closest('[data-hx-reset-after-submit]')) {
            return;
        }

        if ($element.tagName === 'FORM') {
            $element.reset();
        }
    }
});
