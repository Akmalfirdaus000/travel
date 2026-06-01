<?php

namespace Database\Factories;

use App\Models\Armada;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Armada>
 */
class ArmadaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'rute_id' => \App\Models\Rute::factory(),
            'supir_id' => \App\Models\Supir::factory(),
            'plat_nomor' => fake()->unique()->regexify('[A-Z]{1,2}[0-9]{1,4}[A-Z]{1,3}'),
            'tipe_mobil' => fake()->randomElement(['Toyota Avanza', 'Toyota Innova', 'Toyota Hiace', 'Mitsubishi Xpander', 'Daihatsu Xenia', 'Honda Mobilio']),
            'kapasitas_kursi' => fake()->randomElement([7, 8, 10, 12]),
        ];
    }
}
