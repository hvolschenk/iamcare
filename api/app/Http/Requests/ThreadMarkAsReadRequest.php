<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ThreadMarkAsReadRequest extends FormRequest
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
        $thread->load(['userGiver', 'userReceiver']);
        return $thread->userGiver->id === $user->id
            || $thread->userReceiver->id === $user->id;
    }
}
