<?php

namespace App\Http\Resources;

use App\Models\Location;
use App\Services\GooglePlaces;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    /**
     * The "data" wrapper that should be applied.
     *
     * @var string|null
     */
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $language = $request->getPreferredLanguage(GooglePlaces::SUPPORTED_LANGUAGES);
        if ($this->location->language !== $language) {
            $location = Location::fromGooglePlaceID($this->location->googlePlaceID, $language);
            /** @disregard P1014 It's not possible to know the type of `$this` at all */
            $this->location = $location;
        }

        return [
            'dateCreated' => $this->created_at,
            'dateUpdated' => $this->updated_at,
            'description' => $this->description,
            'id' => $this->id,
            'images' => ImageResource::collection($this->images),
            'isGiven' => (bool) $this->is_given,
            'location' => new LocationResource($this->location),
            'name' => $this->name,
            'tags' => TagResource::collection($this->tags),
            'user' => new UserResource($this->user),
        ];
    }
}
