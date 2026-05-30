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
        $armada = [
            [
                'plat_nomor' => 'BA1234AA',
                'tipe_mobil' => 'Toyota Avanza',
                'kapasitas_kursi' => 7,
            ],
            [
                'plat_nomor' => 'BA5678BB',
                'tipe_mobil' => 'Toyota Innova',
                'kapasitas_kursi' => 8,
            ],
            [
                'plat_nomor' => 'BA9012CC',
                'tipe_mobil' => 'Toyota Hiace',
                'kapasitas_kursi' => 12,
            ],
            [
                'plat_nomor' => 'BA3456DD',
                'tipe_mobil' => 'Mitsubishi Xpander',
                'kapasitas_kursi' => 7,
            ],
            [
                'plat_nomor' => 'BA7890EE',
                'tipe_mobil' => 'Daihatsu Xenia',
                'kapasitas_kursi' => 7,
            ],
            [
                'plat_nomor' => 'BA2345FF',
                'tipe_mobil' => 'Honda Mobilio',
                'kapasitas_kursi' => 7,
            ],
            [
                'plat_nomor' => 'BA6789GG',
                'tipe_mobil' => 'Toyota Avanza',
                'kapasitas_kursi' => 7,
            ],
            [
                'plat_nomor' => 'BA0123HH',
                'tipe_mobil' => 'Toyota Innova',
                'kapasitas_kursi' => 8,
            ],
        ];

        foreach ($armada as $data) {
            Armada::create($data);
        }
    }
}
