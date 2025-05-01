<x-layouts.mail>
{{ __('mail.greeting', ['name' => $name]) }}

{{ __('mail.thread-created__body', ['fromName' => $fromName, 'itemName' => $itemName, 'messageText' => $messageText ]) }}
</x-layouts.mail>
