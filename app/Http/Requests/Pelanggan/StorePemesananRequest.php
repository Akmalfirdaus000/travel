<?php

namespace App\Http\Requests\Pelanggan;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePemesananRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'jadwal_id' => 'required|exists:jadwal,id',
            'nomor_kursi' => 'required|array|min:1',
            'nomor_kursi.*' => 'integer|min:1|max:20',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'jadwal_id.required' => 'Jadwal wajib dipilih.',
            'jadwal_id.exists' => 'Jadwal tidak ditemukan.',
            'nomor_kursi.required' => 'Pilih minimal satu kursi.',
            'nomor_kursi.array' => 'Nomor kursi harus berupa array.',
            'nomor_kursi.min' => 'Pilih minimal satu kursi.',
        ];
    }

    /**
     * Prepare data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure nomor_kursi is an array
        if ($this->has('nomor_kursi') && is_string($this->nomor_kursi)) {
            $this->merge([
                'nomor_kursi' => explode(',', $this->nomor_kursi),
            ]);
        }
    }
}
