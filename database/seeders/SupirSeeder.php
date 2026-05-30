<?php

namespace Database\Seeders;

use App\Models\Supir;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupirSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $supir = [
            [
                'nama_supir' => 'Rudi Hartono',
                'no_telp_supir' => '08111222333',
                'status' => 'tersedia',
            ],
            [
                'nama_supir' => 'Dedi Prasetyo',
                'no_telp_supir' => '08111222334',
                'status' => 'tersedia',
            ],
            [
                'nama_supir' => 'Agus Setiawan',
                'no_telp_supir' => '08111222335',
                'status' => 'bertugas',
            ],
            [
                'nama_supir' => 'Bambang Suryadi',
                'no_telp_supir' => '08111222336',
                'status' => 'tersedia',
            ],
            [
                'nama_supir' => 'Cahyo Utomo',
                'no_telp_supir' => '08111222337',
                'status' => 'izin',
            ],
            [
                'nama_supir' => 'Dewi Lestari',
                'no_telp_supir' => '08111222338',
                'status' => 'tersedia',
            ],
            [
                'nama_supir' => 'Eko Prasetyo',
                'no_telp_supir' => '08111222339',
                'status' => 'tersedia',
            ],
            [
                'nama_supir' => 'Feri Irawan',
                'no_telp_supir' => '08111222340',
                'status' => 'bertugas',
            ],
        ];

        foreach ($supir as $data) {
            Supir::create($data);
        }
    }
}
