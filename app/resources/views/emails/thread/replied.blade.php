<x-layouts.mail>
{{ __('mail.thread-replied__title') }}

{{ __('mail.greeting', ['name' => $name]) }}
{{ __('mail.thread-replied__body', ['itemName' => $itemName, 'senderName' => $senderName]) }}
</x-layouts.mail>
