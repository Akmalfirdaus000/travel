<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;
use App\Models\Jadwal;
use App\Models\Rute;

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
            'armada_id.required' => 'Armada wajib dipilih.',
            'armada_id.exists' => 'Armada tidak ditemukan.',
            'tanggal_berangkat.required' => 'Tanggal berangkat wajib diisi.',
            'tanggal_berangkat.after_or_equal' => 'Tanggal berangkat tidak boleh lampau.',
            'jam_berangkat.required' => 'Jam berangkat wajib diisi.',
            'jam_berangkat.date_format' => 'Format jam berangkat tidak valid (HH:MM:SS).',
        ];
    }

    /**
     * Lakukan validasi tambahan setelah validasi dasar.
     */
    public function after(): array
    {
        return [
            function ($validator) {
                $ruteId = $this->input('rute_id');
                $armadaId = $this->input('armada_id');
                $tanggal = $this->input('tanggal_berangkat');
                $jam = $this->input('jam_berangkat');

                if (!$ruteId || !$armadaId || !$tanggal || !$jam) {
                    return;
                }

                $rute = Rute::find($ruteId);
                if (!$rute) return;

                $estimasiBaru = $rute->estimasi_waktu_jam ?? 2;
                
                $startBaru = Carbon::parse("$tanggal $jam");
                $endBaru = clone $startBaru;
                $endBaru->addHours($estimasiBaru);

                // Periksa overlap jadwal armada ini
                $startSearch = (clone $startBaru)->subDay()->toDateString();
                $endSearch = (clone $endBaru)->toDateString();

                $jadwalExist = Jadwal::with('rute')
                    ->where('armada_id', $armadaId)
                    ->whereBetween('tanggal_berangkat', [$startSearch, $endSearch])
                    ->get();

                foreach ($jadwalExist as $jadwal) {
                    $tanggalExist = \Carbon\Carbon::parse($jadwal->tanggal_berangkat)->format('Y-m-d');
                    $waktuExist = \Carbon\Carbon::parse($jadwal->jam_berangkat)->format('H:i:s');
                    $startExist = Carbon::parse("$tanggalExist $waktuExist");
                    $estimasiExist = $jadwal->rute->estimasi_waktu_jam ?? 2;
                    $endExist = clone $startExist;
                    $endExist->addHours($estimasiExist);

                    // Rumus Overlap: StartA < EndB AND EndA > StartB
                    if ($startBaru < $endExist && $endBaru > $startExist) {
                        $validator->errors()->add('armada_id', 'Jadwal armada ini bentrok dengan perjalanan rute ' . $jadwal->rute->kota_asal . ' - ' . $jadwal->rute->kota_tujuan . ' (Pukul ' . $startExist->format('H:i') . ' sampai ' . $endExist->format('H:i') . ').');
                        break;
                    }
                }
            }
        ];
    }
}
