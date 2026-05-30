<?php

namespace Database\Seeders;

use App\Models\DetailPemesanan;
use App\Models\Pemesanan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DetailPemesananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pemesanans = Pemesanan::all();

        foreach ($pemesanans as $pemesanan) {
            // Random 1-3 kursi per pemesanan
            $jumlahKursi = rand(1, 3);

            $usedSeats = DetailPemesanan::whereHas('pemesanan', function ($query) use ($pemesanan) {
                $query->where('jadwal_id', $pemesanan->jadwal_id);
            })->pluck('nomor_kursi')->toArray();

            for ($i = 0; $i < $jumlahKursi; $i++) {
                $seat = $this->getAvailableSeat($usedSeats);
                if ($seat !== null) {
                    DetailPemesanan::create([
                        'pemesanan_id' => $pemesanan->id,
                        'nomor_kursi' => $seat,
                    ]);
                    $usedSeats[] = $seat;
                }
            }
        }
    }

    /**
     * Get available seat number
     */
    private function getAvailableSeat(array $usedSeats): ?int
    {
        for ($i = 1; $i <= 12; $i++) {
            if (!in_array($i, $usedSeats)) {
                return $i;
            }
        }
        return null;
    }
}
