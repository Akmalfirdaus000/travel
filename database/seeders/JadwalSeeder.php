<?php

namespace Database\Seeders;

use App\Models\Jadwal;
use App\Models\Armada;
use App\Models\Rute;
use App\Models\Supir;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class JadwalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the rutes, supirs, and armadas
        $ruteRaoPadang = Rute::where('kota_asal', 'Rao')->where('kota_tujuan', 'Padang')->first();
        $ruteRaoBukittinggi = Rute::where('kota_asal', 'Rao')->where('kota_tujuan', 'Bukittinggi')->first();
        $rutePadangRao = Rute::where('kota_asal', 'Padang')->where('kota_tujuan', 'Rao')->first();
        $rutePadangBukittinggi = Rute::where('kota_asal', 'Padang')->where('kota_tujuan', 'Bukittinggi')->first();
        $ruteBukittinggiRao = Rute::where('kota_asal', 'Bukittinggi')->where('kota_tujuan', 'Rao')->first();

        $supirs = Supir::limit(5)->get();
        $armadas = Armada::limit(5)->get();

        $jadwalData = [];

        // Jadwal hari ini dan besok
        for ($day = 0; $day < 2; $day++) {
            $date = Carbon::now()->addDays($day)->format('Y-m-d');

            // Jadwal Rao -> Padang (pagi dan malam)
            $jadwalData[] = [
                'rute_id' => $ruteRaoPadang->id,
                'supir_id' => $supirs[0]->id,
                'armada_id' => $armadas[0]->id,
                'tanggal_berangkat' => $date,
                'jam_berangkat' => '08:00:00',
            ];

            $jadwalData[] = [
                'rute_id' => $ruteRaoPadang->id,
                'supir_id' => $supirs[1]->id,
                'armada_id' => $armadas[1]->id,
                'tanggal_berangkat' => $date,
                'jam_berangkat' => '20:00:00',
            ];

            // Jadwal Rao -> Bukittinggi
            $jadwalData[] = [
                'rute_id' => $ruteRaoBukittinggi->id,
                'supir_id' => $supirs[2]->id,
                'armada_id' => $armadas[2]->id,
                'tanggal_berangkat' => $date,
                'jam_berangkat' => '09:00:00',
            ];

            // Jadwal Padang -> Rao
            $jadwalData[] = [
                'rute_id' => $rutePadangRao->id,
                'supir_id' => $supirs[3]->id,
                'armada_id' => $armadas[3]->id,
                'tanggal_berangkat' => $date,
                'jam_berangkat' => '08:00:00',
            ];

            // Jadwal Padang -> Bukittinggi
            $jadwalData[] = [
                'rute_id' => $rutePadangBukittinggi->id,
                'supir_id' => $supirs[0]->id,
                'armada_id' => $armadas[0]->id,
                'tanggal_berangkat' => $date,
                'jam_berangkat' => '14:00:00',
            ];

            // Jadwal Bukittinggi -> Rao
            $jadwalData[] = [
                'rute_id' => $ruteBukittinggiRao->id,
                'supir_id' => $supirs[4]->id,
                'armada_id' => $armadas[4]->id,
                'tanggal_berangkat' => $date,
                'jam_berangkat' => '10:00:00',
            ];
        }

        foreach ($jadwalData as $data) {
            Jadwal::create($data);
        }
    }
}
