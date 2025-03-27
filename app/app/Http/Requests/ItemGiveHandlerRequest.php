<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ItemGiveHandlerRequest extends FormRequest
{
    /**
     * The route that users should be redirected to if validation fails.
     *
     * @var string
     */
    protected $redirectRoute = 'itemGiveForm';

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        if (!$user) {
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
            'description' => ['required', 'string'],
            'image' => ['required', 'array'],
            'image.*' => ['image'],
            'location' => ['required', 'string'],
            'name' => ['required', 'string'],
            'tag' => ['required', 'array'],
        ];
    }
}
