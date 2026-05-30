<?php

namespace Database\Factories;

use App\Models\Rute;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Rute>
 */
class RuteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $kota = [
            'Rao', 'Padang', 'Bukittinggi', 'Pekanbaru', 'Payakumbuh',
            'Solok', 'Batusangkar', 'Padang Panjang', 'Parit Malintang',
            'Lubuk Sikaping', 'Pantai Cermin', 'Santiago'
        ];

        $asal = fake()->randomElement($kota);
        $tujuan = fake()->randomElement(array_diff($kota, [$asal]));

        return [
            'kota_asal' => $asal,
            'kota_tujuan' => $tujuan,
            'harga_tiket' => fake()->numberBetween(50000, 300000),
        ];
    }
}
