<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'facebook' => [
        'profile_url' => env('FACEBOOK_PROFILE_URL'),
    ],

    'google' => [
        'client_id' => env('GOOGLE_IDENTITY_CLIENT_ID'),
        'client_secret' => env('GOOGLE_IDENTITY_CLIENT_SECRET'),
        'redirect' => '/login/google',
    ],

    'microsoft' => [
        'client_id' => env('MICROSOFT_ENTRA_CLIENT_ID'),
        'client_secret' => env('MICROSOFT_ENTRA_CLIENT_SECRET'),
        'include_avatar' => true,
        'include_avatar_size' => '28x28',
        'redirect' => '/login/microsoft',
        'tenant' => 'common',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'x' => [
        'profile_url' => env('X_PROFILE_URL'),
    ],

];
