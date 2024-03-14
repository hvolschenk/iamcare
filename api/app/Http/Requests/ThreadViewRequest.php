<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ThreadViewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        if (!$user) {
            return false;
        }
        $thread = $this->route('thread');
        return $thread->user_id_giver === $user->id
            || $thread->user_id_receiver === $user->id;
    }
}
