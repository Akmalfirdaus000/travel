<?php

namespace Database\Seeders;

use App\Models\Pembayaran;
use App\Models\Pemesanan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PembayaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create pembayaran only for pemesanan with status 'lunas' or 'pending'
        $pemesanans = Pemesanan::whereIn('status_bayar', ['lunas', 'pending'])->get();

        foreach ($pemesanans as $pemesanan) {
            Pembayaran::create([
                'pemesanan_id' => $pemesanan->id,
                'bukti_transfer' => 'bukti_' . $pemesanan->kode_booking . '.jpg',
                'tanggal_transfer' => $pemesanan->tanggal_pesan->addMinutes(30),
            ]);
        }
    }
}
