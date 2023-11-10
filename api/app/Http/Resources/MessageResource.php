<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
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
            'isRead' => $this->isRead,
            'message' => $this->message,
            'user' => $this->whenHas('user', new UserResource($this->user)),
            'userID' => $this->user_id,
        ];
    }
}
