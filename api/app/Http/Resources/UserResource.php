<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
        return [
            'avatar' => $this->avatar,
            'dateCreated' => $this->created_at->toISOString(),
            'dateUpdated' => $this->updated_at->toISOString(),
            'email' => $this->when($user !== null && $user->id === $this->id, $this->email),
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}
