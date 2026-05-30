<?php

namespace Database\Factories;

use App\Models\Pembayaran;
use App\Models\Pemesanan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pembayaran>
 */
class PembayaranFactory extends Factory
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
            'bukti_transfer' => fake()->imageUrl(400, 300, 'receipt'),
            'tanggal_transfer' => fake()->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
