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
            'email' => 'admin@sukratravel.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        // Create super admin user
        User::create([
            'name' => 'Super Administrator',
            'email' => 'superadmin@sukratravel.com',
            'password' => Hash::make('super123'),
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
