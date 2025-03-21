<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $reporter = $this->user();
        if (!$reporter) {
            return false;
        }

        $reported = $this->route('user');
        if ($reporter->id === $reported->id) {
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
        return [];
    }
}
