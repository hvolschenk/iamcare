<x-layouts.mail>
    {{ __('mail.greeting', ['name' => 'administrator']) }}
    {{
        __('mail.user-reported__body', [
            'reason' => $userReport->reason,
            'reported' => "{$userReport->userReported->name} (#{$userReport->userReported->id})",
            'reporter' => "{$userReport->userReporter->name} (#{$userReport->userReporter->id})",
        ])
    }}
</x-layouts.mail>
