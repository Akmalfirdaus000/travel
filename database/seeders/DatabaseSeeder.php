<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('123'),
            'role' => 'admin',
        ]);

        // Create super admin user
        User::create([
            'name' => 'Super Administrator',
            'email' => 'superadmin@gmail.com',
            'password' => Hash::make('123'),
            'role' => 'super_admin',
        ]);

        // Call all seeders in proper order
        $this->call([
            SupirSeeder::class,
            ArmadaSeeder::class,
            RuteSeeder::class,
            JadwalSeeder::class,
            PelangganSeeder::class,
            PemesananSeeder::class,
            DetailPemesananSeeder::class,
            PembayaranSeeder::class,
        ]);
    }
}
