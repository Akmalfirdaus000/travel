<?php

namespace Database\Seeders;

use App\Models\Armada;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ArmadaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $supirs = \App\Models\Supir::all();

        $armada = [
            [
                'plat_nomor' => 'BA1234AA',
                'tipe_mobil' => 'Toyota Avanza',
                'kapasitas_kursi' => 7,
                'supir_id' => $supirs[0]->id ?? 1,
            ],
            [
                'plat_nomor' => 'BA5678BB',
                'tipe_mobil' => 'Toyota Innova',
                'kapasitas_kursi' => 8,
                'supir_id' => $supirs[1]->id ?? 2,
            ],
            [
                'plat_nomor' => 'BA9012CC',
                'tipe_mobil' => 'Toyota Hiace',
                'kapasitas_kursi' => 12,
                'supir_id' => $supirs[2]->id ?? 3,
            ],
            [
                'plat_nomor' => 'BA3456DD',
                'tipe_mobil' => 'Mitsubishi Xpander',
                'kapasitas_kursi' => 7,
                'supir_id' => $supirs[3]->id ?? 4,
            ],
            [
                'plat_nomor' => 'BA7890EE',
                'tipe_mobil' => 'Daihatsu Xenia',
                'kapasitas_kursi' => 7,
                'supir_id' => $supirs[4]->id ?? 5,
            ],
            [
                'plat_nomor' => 'BA2345FF',
                'tipe_mobil' => 'Honda Mobilio',
                'kapasitas_kursi' => 7,
                'supir_id' => $supirs[0]->id ?? 1,
            ],
            [
                'plat_nomor' => 'BA6789GG',
                'tipe_mobil' => 'Toyota Avanza',
                'kapasitas_kursi' => 7,
                'supir_id' => $supirs[1]->id ?? 2,
            ],
            [
                'plat_nomor' => 'BA0123HH',
                'tipe_mobil' => 'Toyota Innova',
                'kapasitas_kursi' => 8,
                'supir_id' => $supirs[2]->id ?? 3,
            ],
        ];

        foreach ($armada as $data) {
            Armada::create($data);
        }
    }
}
