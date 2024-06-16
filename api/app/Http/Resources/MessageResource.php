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
            'isRead' => $this->is_read,
            'message' => $this->message,
            'user' => $this->whenHas('user', new UserResource($this->user)),
            // I don't get why this is necessary.
            // The value is correctly an integer in development,
            // but is a string in production.
            // Some posts point to a missing `mysqlnd`, but that IS installed.
            'userID' => intval($this->user_id, 10),
        ];
    }
}
