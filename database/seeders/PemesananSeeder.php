<?php

namespace Database\Seeders;

use App\Models\Jadwal;
use App\Models\Pemesanan;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PemesananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jadwalIds = Jadwal::pluck('id')->toArray();
        $pelangganUsers = User::where('role', 'pelanggan')->get();

        $pemesananCount = 0;
        $maxPemesanan = 20;

        foreach ($pelangganUsers as $user) {
            if ($pemesananCount >= $maxPemesanan) {
                break;
            }

            foreach ($jadwalIds as $jadwalId) {
                if ($pemesananCount >= $maxPemesanan) {
                    break;
                }

                $jadwal = Jadwal::find($jadwalId);
                $totalBayar = $jadwal->rute->harga_tiket * rand(1, 3);

                $pemesanan = Pemesanan::create([
                    'user_id' => $user->id,
                    'jadwal_id' => $jadwalId,
                    'kode_booking' => 'BRN-' . date('Ymd') . str_pad($pemesananCount + 1, 3, '0', STR_PAD_LEFT),
                    'total_bayar' => $totalBayar,
                    'status_bayar' => ['pending', 'lunas', 'batal'][array_rand(['pending', 'lunas', 'batal'])],
                    'tanggal_pesan' => now(),
                ]);

                $pemesananCount++;
            }
        }
    }
}
