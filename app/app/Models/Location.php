<?php

namespace App\Models;

use App\Services\GooglePlaces;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;

class Location extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'address',
        'googlePlaceID',
        'language',
        'latitude',
        'longitude',
        'name',
        'utcOffset',
    ];

    /**
     * The items in this location
     */
    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }

    public static function fetchFromGooglePlaces(string $googlePlaceID, string $language): Location
    {
        $googlePlaces = App::make(GooglePlaces::class);
        $googlePlaceDetails = $googlePlaces->placeDetails($googlePlaceID, $language);
        $location = new Location([
            'address' => $googlePlaceDetails['result']['formatted_address'],
            'googlePlaceID' => $googlePlaceDetails['result']['place_id'],
            'language' => $language,
            'latitude' => $googlePlaceDetails['result']['geometry']['location']['lat'],
            'longitude' => $googlePlaceDetails['result']['geometry']['location']['lng'],
            'name' => $googlePlaceDetails['result']['name'],
            'utcOffset' => $googlePlaceDetails['result']['utc_offset'],
        ]);
        $location->save();
        Log::debug('Location: From Google Place ID: Fetched', ['id' => $location->id]);

        return $location;
    }

    public static function fromGooglePlaceID(string $googlePlaceID, string $language): Location
    {
        Log::withContext(['googlePlaceID' => $googlePlaceID, 'language' => $language]);
        Log::debug('Location: From Google Place ID: Start');
        try {
            $location = Location::where([
                'googlePlaceID' => $googlePlaceID,
                'language' => $language,
            ])->firstOrFail();
            Log::debug('Location: From Google Place ID: Found', ['id' => $location->id]);

            return $location;
        } catch (\Exception $error) {
            $location = self::fetchFromGooglePlaces($googlePlaceID, $language);

            return $location;
        }
    }
}
