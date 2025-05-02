<x-layouts.mail>
{{ __('mail.greeting', ['name' => $name]) }}

{{
    __(
        'mail.thread-created__body',
        [
            'applicationName' => config('app.name'),
            'fromName' => $fromName,
            'itemName' => $itemName,
            'messageText' => $messageText,
        ],
    )
}}
</x-layouts.mail>
