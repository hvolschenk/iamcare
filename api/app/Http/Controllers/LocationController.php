<?php

namespace App\Http\Controllers;

use App\Http\Resources\LocationResource;
use App\Models\Location;
use App\Services\GooglePlaces;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function show(Location $location)
    {
        return new LocationResource($location);
    }

    public function google(Request $request, string $googlePlaceID)
    {
        $language = $request->getPreferredLanguage(GooglePlaces::SUPPORTED_LANGUAGES);
        $location = Location::fromGooglePlaceID($googlePlaceID, $language);
        return new LocationResource($location);
    }
}
