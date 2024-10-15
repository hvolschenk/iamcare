<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GooglePlaces
{
    // This is an intersection between languages supported by iamcare
    // and languages supported by the Google Places API.
    // https://developers.google.com/maps/faq#languagesupport
    public const SUPPORTED_LANGUAGES = ['af', 'en', 'nl'];

    public function placeDetails(string $placeID, string $language)
    {
        Log::debug('Place details', ['language' => $language, 'placeID' => $placeID]);
        $request = Http::googlePlaces()
            ->get('/place/details/json', [
                'fields' => 'formatted_address,geometry,name,place_id,utc_offset',
                // This is rather shitty, honestly
                // The Macros don't seem to support default query string parameters
                // https://laravel.com/docs/10.x/http-client#macros
                'key' => config('google.places.api_key'),
                'language' => $language,
                'place_id' => $placeID,
            ]);

        return $request->json();
    }
}
