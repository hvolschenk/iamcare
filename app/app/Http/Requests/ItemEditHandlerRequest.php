<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ItemEditHandlerRequest extends FormRequest
{
    /**
     * Get the URL to redirect to on a validation error.
     *
     * @return string
     */
    protected function getRedirectUrl()
    {
        $item = $this->route('item');
        return route('itemEditForm', $item);
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var \Illuminate\Contracts\Auth\Guard $auth */
        $auth = auth();
        if (!$auth->check()) {
            return false;
        }
        $user = $this->user();
        $item = $this->route('item');
        $item->load(['user']);
        return $user->id === $item->user->id;
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
            'image' => ['required_without:imageExisting', 'array'],
            'image.*' => ['image'],
            'imageExisting' => ['required_without:image', 'array'],
            'imageExisting.*' => ['string'],
            'location' => ['required', 'string'],
            'name' => ['required', 'string'],
            'tag' => ['required', 'array'],
        ];
    }
}
