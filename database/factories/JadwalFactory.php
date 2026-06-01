<?php

namespace Database\Factories;

use App\Models\Armada;
use App\Models\Jadwal;
use App\Models\Rute;
use App\Models\Supir;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Jadwal>
 */
class JadwalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tanggal = fake()->dateTimeBetween('now', '+30 days');

        return [
            'armada_id' => Armada::factory(),
            'tanggal_berangkat' => $tanggal->format('Y-m-d'),
            'jam_berangkat' => fake()->time('H:i:s'),
        ];
    }
}
