<?php

namespace Database\Seeders;

use App\Models\Pelanggan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PelangganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create specific pelanggan users
        $users = [
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@gmail.com',
                'password' => Hash::make('123'),
                'role' => 'pelanggan',
                'no_telp' => '081234567890',
                'alamat' => 'Jl. Merdeka No. 10, Padang',
                'jenis_kelamin' => 'L',
            ],
            [
                'name' => 'Siti Rahayu',
                'email' => 'siti@gmail.com',
                'password' => Hash::make('123'),
                'role' => 'pelanggan',
                'no_telp' => '081234567891',
                'alamat' => 'Jl. Sudirman No. 25, Bukittinggi',
                'jenis_kelamin' => 'P',
            ],
            [
                'name' => 'Ahmad Fauzi',
                'email' => 'ahmad@gmail.com',
                'password' => Hash::make('123'),
                'role' => 'pelanggan',
                'no_telp' => '081234567892',
                'alamat' => 'Jl. Gatot Subroto No. 5, Pekanbaru',
                'jenis_kelamin' => 'L',
            ],
        ];

        foreach ($users as $userData) {
            $noTelp = $userData['no_telp'];
            $alamat = $userData['alamat'];
            $jenisKelamin = $userData['jenis_kelamin'];

            unset($userData['no_telp'], $userData['alamat'], $userData['jenis_kelamin']);

            $user = User::create($userData);

            Pelanggan::create([
                'user_id' => $user->id,
                'no_telp' => $noTelp,
                'alamat' => $alamat,
                'jenis_kelamin' => $jenisKelamin,
            ]);
        }

        // Create random pelanggan
        Pelanggan::factory(10)->create();
    }
}
