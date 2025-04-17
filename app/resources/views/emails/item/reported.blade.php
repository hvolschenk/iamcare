<x-layouts.mail>
{{ __('mail.greeting', ['name' => 'administrator']) }}

{{
    __('mail.item-reported__body', [
        'item' => "{$itemReport->item->name} (#{$itemReport->item->id})",
        'reason' => $itemReport->reason,
        'user' => "{$itemReport->user->name} (#{$itemReport->user->id})",
    ])
}}
</x-layouts.mail>
