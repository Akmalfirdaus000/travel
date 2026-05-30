<?php

namespace Database\Seeders;

use App\Models\Rute;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RuteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rute = [
            [
                'kota_asal' => 'Rao',
                'kota_tujuan' => 'Padang',
                'harga_tiket' => 75000.00,
            ],
            [
                'kota_asal' => 'Rao',
                'kota_tujuan' => 'Bukittinggi',
                'harga_tiket' => 85000.00,
            ],
            [
                'kota_asal' => 'Rao',
                'kota_tujuan' => 'Pekanbaru',
                'harga_tiket' => 150000.00,
            ],
            [
                'kota_asal' => 'Padang',
                'kota_tujuan' => 'Rao',
                'harga_tiket' => 75000.00,
            ],
            [
                'kota_asal' => 'Padang',
                'kota_tujuan' => 'Bukittinggi',
                'harga_tiket' => 65000.00,
            ],
            [
                'kota_asal' => 'Bukittinggi',
                'kota_tujuan' => 'Padang',
                'harga_tiket' => 65000.00,
            ],
            [
                'kota_asal' => 'Bukittinggi',
                'kota_tujuan' => 'Rao',
                'harga_tiket' => 85000.00,
            ],
            [
                'kota_asal' => 'Pekanbaru',
                'kota_tujuan' => 'Rao',
                'harga_tiket' => 150000.00,
            ],
            [
                'kota_asal' => 'Payakumbuh',
                'kota_tujuan' => 'Padang',
                'harga_tiket' => 80000.00,
            ],
            [
                'kota_asal' => 'Solok',
                'kota_tujuan' => 'Padang',
                'harga_tiket' => 55000.00,
            ],
        ];

        foreach ($rute as $data) {
            Rute::create($data);
        }
    }
}
