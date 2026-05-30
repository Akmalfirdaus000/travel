<?php

namespace Database\Factories;

use App\Models\Jadwal;
use App\Models\Pemesanan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pemesanan>
 */
class PemesananFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tanggalPesan = fake()->dateTimeBetween('-30 days', 'now');

        return [
            'user_id' => User::factory(),
            'jadwal_id' => Jadwal::factory(),
            'kode_booking' => 'BRN-' . date('Ymd') . fake()->unique()->numberBetween(1, 999),
            'total_bayar' => fake()->numberBetween(50000, 300000),
            'status_bayar' => fake()->randomElement(['pending', 'lunas', 'batal']),
            'tanggal_pesan' => $tanggalPesan,
        ];
    }
}
