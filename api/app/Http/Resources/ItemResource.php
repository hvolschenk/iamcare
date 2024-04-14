<?php

namespace App\Http\Resources;

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
        return [
            'dateCreated' => $this->created_at,
            'dateUpdated' => $this->updated_at,
            'description' => $this->description,
            'id' => $this->id,
            'images' => ImageResource::collection($this->images),
            'isGiven' => (bool) $this->is_given,
            'location' => new LocationResource($this->location), // HENDRIK THESE NEED TO BE FOUND FOR A SPECIFIC LANGUAGE, NO?
            'name' => $this->name,
            'tags' => TagResource::collection($this->tags),
            'user' => new UserResource($this->user),
        ];
    }
}
