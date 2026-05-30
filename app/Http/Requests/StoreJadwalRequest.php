<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreJadwalRequest extends FormRequest
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
            'rute_id' => 'required|exists:rute,id',
            'supir_id' => 'required|exists:supir,id',
            'armada_id' => 'required|exists:armada,id',
            'tanggal_berangkat' => 'required|date|after_or_equal:today',
            'jam_berangkat' => 'required|date_format:H:i:s',
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
            'rute_id.required' => 'Rute wajib dipilih.',
            'rute_id.exists' => 'Rute tidak ditemukan.',
            'supir_id.required' => 'Supir wajib dipilih.',
            'supir_id.exists' => 'Supir tidak ditemukan.',
            'armada_id.required' => 'Armada wajib dipilih.',
            'armada_id.exists' => 'Armada tidak ditemukan.',
            'tanggal_berangkat.required' => 'Tanggal berangkat wajib diisi.',
            'tanggal_berangkat.after_or_equal' => 'Tanggal berangkat tidak boleh lampau.',
            'jam_berangkat.required' => 'Jam berangkat wajib diisi.',
            'jam_berangkat.date_format' => 'Format jam berangkat tidak valid (HH:MM:SS).',
        ];
    }
}
