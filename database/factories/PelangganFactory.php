<?php

namespace Database\Factories;

use App\Models\Pelanggan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pelanggan>
 */
class PelangganFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'no_telp' => fake()->regexify('08[0-9]{8,11}'),
            'alamat' => fake()->address(),
            'jenis_kelamin' => fake()->randomElement(['L', 'P']),
        ];
    }
}
