<?php

namespace Database\Factories;

use App\Models\Supir;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Supir>
 */
class SupirFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_supir' => fake()->name(),
            'no_telp_supir' => fake()->regexify('08[0-9]{8,11}'),
            'status' => fake()->randomElement(['tersedia', 'bertugas', 'izin']),
        ];
    }
}
