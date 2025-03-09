<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Google Analytics
    |--------------------------------------------------------------------------
    |
    | Settings related to Google Analytics.
    | https://analytics.google.com/
    |
    */
    'analytics' => [
        'measurement_id' => env('GOOGLE_ANALYTICS_MEASUREMENT_ID'),
    ],
    /*
    |--------------------------------------------------------------------------
    | Google Identity Services
    |--------------------------------------------------------------------------
    |
    | Settings related to Google Identity Services (GIS).
    | https://developers.google.com/identity
    |
    */
    'identity' => [
        'client_id' => env('GOOGLE_IDENTITY_CLIENT_ID'),
    ],
    /*
    |--------------------------------------------------------------------------
    | Google Places
    |--------------------------------------------------------------------------
    |
    | Settings related to the Google Places JavaScript API.
    | https://developers.google.com/maps/documentation/javascript/place
    |
    */
    'places' => [
        'api_key' => env('GOOGLE_PLACES_API_KEY'),
        'region' => env('GOOGLE_PLACES_REGION', 'za'),
    ],
];
