<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LocationResource extends JsonResource
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
        return [
            'address' => $this->address,
            'dateCreated' => $this->created_at,
            'dateUpdated' => $this->updated_at,
            'googlePlaceID' => $this->googlePlaceID,
            'id' => $this->id,
            'itemsCount' => $this->whenHas('items_count'),
            'language' => $this->language, // HENDRIK THIS SEEMS WRONG? HOW DO I GET FOR A SPECIFIC LANGUAGE?
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'name' => $this->name,
            'utcOffset' => $this->utcOffset,
        ];
    }
}
