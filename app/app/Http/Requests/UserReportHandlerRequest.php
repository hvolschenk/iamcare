<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserReportHandlerRequest extends FormRequest
{
    /**
     * Get the URL to redirect to on a validation error.
     *
     * @return string
     */
    protected function getRedirectUrl()
    {
        $user = $this->route('user');
        return route('reportUserForm', $user);
    }

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
        return [
            'reason' => ['required', 'string'],
        ];
    }
}
