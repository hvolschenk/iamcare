<x-layouts.mail>
{{ __('mail.greeting', ['name' => $name]) }}

{{ __('mail.account-created__body', ['applicationName' => config('app.name')]) }}
</x-layouts.mail>
