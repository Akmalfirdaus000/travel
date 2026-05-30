<?php

namespace App\Http\Requests;

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
            'user_id' => 'required|exists:users,id',
            'jadwal_id' => 'required|exists:jadwal,id',
            'jumlah_kursi' => 'required|integer|min:1|max:12',
            'nomor_kursi' => 'required|array|min:1',
            'nomor_kursi.*' => 'integer|min:1|max:12',
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
            'user_id.required' => 'Pelanggan wajib dipilih.',
            'user_id.exists' => 'Pelanggan tidak ditemukan.',
            'jadwal_id.required' => 'Jadwal wajib dipilih.',
            'jadwal_id.exists' => 'Jadwal tidak ditemukan.',
            'jumlah_kursi.required' => 'Jumlah kursi wajib diisi.',
            'jumlah_kursi.min' => 'Minimal memesan 1 kursi.',
            'jumlah_kursi.max' => 'Maksimal memesan 12 kursi.',
            'nomor_kursi.required' => 'Nomor kursi wajib dipilih.',
            'nomor_kursi.array' => 'Nomor kursi harus berupa array.',
        ];
    }
}
