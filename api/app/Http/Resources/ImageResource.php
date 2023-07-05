<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ImageResource extends JsonResource
{
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
            'id' => $this->id,
            'mimeType' => $this->mimeType,
            'name' => $this->name,
            'sizeBytes' => $this->sizeBytes,
            'url' => $this->url,
        ];
    }
}
