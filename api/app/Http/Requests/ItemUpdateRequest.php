<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class ItemUpdateRequest extends FormRequest
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
        $item = $this->route('item');
        return $user->id === $item->user_id;
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
            'image' => ['array'],
            'image.*' => ['image'],
            'location' => ['required', 'string'],
            'name' => ['required', 'string'],
            'removeImage' => ['array'],
            'removeImage.*' => ['integer'],
            'tag' => ['required', 'array'],
        ];
    }

    public function after(): array
    {
        $item = $this->route('item');
        return [
            function (Validator $validator) use ($item) {
                $images = $this->input('image') ?? [];
                $removeImages = $this->input('removeImage') ?? [];
                if (count($images) === 0 && count($item->images) === count($removeImages)) {
                    $validator->errors()->add(
                        'image',
                        __(
                            'validation.required',
                            ['attribute' => __('validation.attributes.images')],
                        ),
                    );
                }
            }
        ];
    }
}
