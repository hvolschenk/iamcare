<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ThreadReplyRequest extends FormRequest
{
    /**
     * Get the URL to redirect to on a validation error.
     *
     * @return string
     */
    protected function getRedirectUrl()
    {
        $thread = $this->route('thread');

        return route('threadReplyForm', $thread);
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        if (! $user) {
            return false;
        }
        $thread = $this->route('thread');

        return $thread->userGiver->id === $user->id
            || $thread->userReceiver->id === $user->id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'message' => ['required', 'string'],
        ];
    }
}
