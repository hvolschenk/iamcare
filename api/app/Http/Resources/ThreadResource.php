<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ThreadResource extends JsonResource
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
        $user = $request->user();
        $hasUnreadMessages = false;
        foreach ($this->messages as $message) {
            if (!$message->is_read && $message->user->id !== $user->id) {
                $hasUnreadMessages = true;
                break;
            }
        }
        return [
            'dateCreated' => $this->created_at,
            'dateUpdated' => $this->updated_at,
            'hasUnreadMessages' => $hasUnreadMessages,
            'id' => $this->id,
            'item' => new ItemResource($this->item),
            'messages' => MessageResource::collection($this->messages),
            'userGiver' => new UserResource($this->userGiver),
            'userReceiver' => new UserResource($this->userReceiver),
        ];
    }
}
