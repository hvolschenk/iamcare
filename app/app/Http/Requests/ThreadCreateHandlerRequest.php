<?php

namespace App\Http\Requests;

use App\Models\Thread;
use Illuminate\Foundation\Http\FormRequest;

class ThreadCreateHandlerRequest extends FormRequest
{
    /**
     * Get the URL to redirect to on a validation error.
     *
     * @return string
     */
    protected function getRedirectUrl()
    {
        $item = $this->route('item');

        return route('threadCreateForm', $item);
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

        $item = $this->route('item');
        if ($item->user->id === $user->id) {
            return false;
        }

        $thread = Thread::where([
            'item_id' => $item->id,
            'user_id_receiver' => $user->id,
        ])->first();
        if ($thread !== null) {
            return false;
        }

        return true;
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
