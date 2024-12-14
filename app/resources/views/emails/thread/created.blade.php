<x-layouts.mail>
{{ __('mail.thread-created__title') }}

{{ __('mail.greeting', ['name' => $name]) }}
{{ __('mail.thread-created__body', ['itemName' => $itemName]) }}
</x-layouts.mail>
