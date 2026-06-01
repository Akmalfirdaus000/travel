<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreArmadaRequest extends FormRequest
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
            'supir_id' => 'required|exists:supir,id',
            'plat_nomor' => 'required|string|max:15|unique:armada,plat_nomor',
            'tipe_mobil' => 'required|string|max:50',
            'kapasitas_kursi' => 'required|integer|min:1|max:20',
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
            'supir_id.required' => 'Supir wajib dipilih.',
            'supir_id.exists' => 'Supir tidak valid.',
            'plat_nomor.required' => 'Plat nomor wajib diisi.',
            'plat_nomor.unique' => 'Plat nomor sudah terdaftar.',
            'tipe_mobil.required' => 'Tipe mobil wajib diisi.',
            'kapasitas_kursi.required' => 'Kapasitas kursi wajib diisi.',
            'kapasitas_kursi.min' => 'Kapasitas kursi minimal 1.',
            'kapasitas_kursi.max' => 'Kapasitas kursi maksimal 20.',
        ];
    }
}
