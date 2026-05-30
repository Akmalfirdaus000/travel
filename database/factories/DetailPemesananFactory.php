<?php

namespace Database\Factories;

use App\Models\DetailPemesanan;
use App\Models\Pemesanan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DetailPemesanan>
 */
class DetailPemesananFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'pemesanan_id' => Pemesanan::factory(),
            'nomor_kursi' => fake()->numberBetween(1, 12),
        ];
    }
}
