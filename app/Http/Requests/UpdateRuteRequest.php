<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRuteRequest extends FormRequest
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
            'kota_asal' => 'required|string|max:50',
            'kota_tujuan' => 'required|string|max:50',
            'harga_tiket' => 'required|numeric|min:0|max:99999999.99',
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
            'kota_asal.required' => 'Kota asal wajib diisi.',
            'kota_tujuan.required' => 'Kota tujuan wajib diisi.',
            'harga_tiket.required' => 'Harga tiket wajib diisi.',
            'harga_tiket.numeric' => 'Harga tiket harus berupa angka.',
            'harga_tiket.min' => 'Harga tiket tidak boleh negatif.',
        ];
    }
}
