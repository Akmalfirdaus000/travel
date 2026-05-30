<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSupirRequest extends FormRequest
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
            'nama_supir' => 'required|string|max:100',
            'no_telp_supir' => 'required|string|max:15',
            'status' => 'required|in:tersedia,bertugas,izin',
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
            'nama_supir.required' => 'Nama supir wajib diisi.',
            'nama_supir.max' => 'Nama supir maksimal 100 karakter.',
            'no_telp_supir.required' => 'Nomor telepon wajib diisi.',
            'no_telp_supir.max' => 'Nomor telepon maksimal 15 karakter.',
            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status harus tersedia, bertugas, atau izin.',
        ];
    }
}
