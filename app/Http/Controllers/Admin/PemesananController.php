<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePemesananRequest;
use App\Http\Requests\UpdatePemesananRequest;
use App\Models\Jadwal;
use App\Models\Pemesanan;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class PemesananController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        // Auto-cleanup: Hapus pesanan pending/batal yang jadwalnya sudah lewat
        $expiredPemesanan = Pemesanan::whereIn('status_bayar', ['pending', 'batal'])
            ->whereHas('jadwal', function ($query) {
                $query->where('tanggal_berangkat', '<', now()->toDateString())
                      ->orWhere(function ($q) {
                          $q->where('tanggal_berangkat', '=', now()->toDateString())
                            ->where('jam_berangkat', '<', now()->toTimeString());
                      });
            })->get();

        foreach ($expiredPemesanan as $pesanan) {
            $pesanan->delete();
        }

        $now = now()->format('Y-m-d H:i:s');

        // Pesanan Aktif: Lunas/Pending yang belum selesai (berdasarkan estimasi_waktu_jam)
        $pesanan_aktif = Pemesanan::with(['user', 'jadwal.rute', 'jadwal.supir', 'jadwal.armada', 'detailPemesanan'])
            ->whereHas('jadwal', function ($query) {
                $query->where('tanggal_berangkat', '>=', now()->subDay()->toDateString()); // Optimasi query untuk menghindari table scan
            })
            ->orderBy('tanggal_pesan', 'desc')
            ->get()
            ->filter(function ($pesanan) {
                $jadwal = $pesanan->jadwal;
                if (!$jadwal || !$jadwal->rute) return false;
                $tanggal = \Carbon\Carbon::parse($jadwal->tanggal_berangkat)->format('Y-m-d');
                $waktu = \Carbon\Carbon::parse($jadwal->jam_berangkat)->format('H:i:s');
                $berangkat = \Carbon\Carbon::parse("$tanggal $waktu");
                $estimasi = $jadwal->rute->estimasi_waktu_jam ?? 0;
                $tiba = $berangkat->copy()->addHours($estimasi);
                return now() <= $tiba;
            })
            ->values();

        // Manual pagination
        $currentPage = \Illuminate\Pagination\Paginator::resolveCurrentPage('aktif_page');
        $perPage = 10;
        $pesanan_aktif_paginated = new \Illuminate\Pagination\LengthAwarePaginator(
            $pesanan_aktif->forPage($currentPage, $perPage),
            $pesanan_aktif->count(),
            $perPage,
            $currentPage,
            ['path' => \Illuminate\Pagination\Paginator::resolveCurrentPath(), 'pageName' => 'aktif_page']
        );

        // Riwayat Pesanan: Sudah selesai perjalanannya
        $riwayat_pesanan = Pemesanan::with(['user', 'jadwal.rute', 'jadwal.supir', 'jadwal.armada', 'detailPemesanan'])
            ->whereHas('jadwal', function ($query) {
                // Semua jadwal di masa lalu mungkin sudah selesai
            })
            ->orderBy('tanggal_pesan', 'desc')
            ->get()
            ->filter(function ($pesanan) {
                $jadwal = $pesanan->jadwal;
                if (!$jadwal || !$jadwal->rute) return true;
                $tanggal = \Carbon\Carbon::parse($jadwal->tanggal_berangkat)->format('Y-m-d');
                $waktu = \Carbon\Carbon::parse($jadwal->jam_berangkat)->format('H:i:s');
                $berangkat = \Carbon\Carbon::parse("$tanggal $waktu");
                $estimasi = $jadwal->rute->estimasi_waktu_jam ?? 0;
                $tiba = $berangkat->copy()->addHours($estimasi);
                return now() > $tiba;
            })
            ->values();

        // Manual pagination
        $currentRiwayatPage = \Illuminate\Pagination\Paginator::resolveCurrentPage('riwayat_page');
        $riwayat_pesanan_paginated = new \Illuminate\Pagination\LengthAwarePaginator(
            $riwayat_pesanan->forPage($currentRiwayatPage, $perPage),
            $riwayat_pesanan->count(),
            $perPage,
            $currentRiwayatPage,
            ['path' => \Illuminate\Pagination\Paginator::resolveCurrentPath(), 'pageName' => 'riwayat_page']
        );

        return Inertia::render('admin/pemesanan/index', [
            'pesanan_aktif' => $pesanan_aktif_paginated,
            'riwayat_pesanan' => $riwayat_pesanan_paginated,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $jadwal = Jadwal::with('rute')->where('tanggal_berangkat', '>=', now()->toDateString())->get();
        $pelanggan = User::where('role', 'pelanggan')->get();

        return Inertia::render('admin/pemesanan/create', [
            'jadwal' => $jadwal,
            'pelanggan' => $pelanggan,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePemesananRequest $request)
    {
        $jadwal = Jadwal::findOrFail($request->jadwal_id);
        
        $latestBooking = Pemesanan::whereDate('created_at', today())->orderBy('id', 'desc')->first();
        $lastSequence = $latestBooking ? (int) substr($latestBooking->kode_booking, -3) : 0;
        $kodeBooking = 'BRN-'.date('Ymd').str_pad($lastSequence + 1, 3, '0', STR_PAD_LEFT);

        $pemesanan = Pemesanan::create([
            'user_id' => $request->user_id,
            'jadwal_id' => $request->jadwal_id,
            'kode_booking' => $kodeBooking,
            'total_bayar' => $jadwal->rute->harga_tiket * $request->jumlah_kursi,
            'status_bayar' => 'pending',
            'tanggal_pesan' => now(),
        ]);

        foreach ($request->nomor_kursi as $kursi) {
            $pemesanan->detailPemesanan()->create([
                'nomor_kursi' => $kursi,
            ]);
        }

        return redirect()->route('admin.pemesanan.index')
            ->with('success', 'Pemesanan berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Pemesanan $pemesanan): Response
    {
        $pemesanan->load(['user', 'jadwal.rute', 'jadwal.supir', 'jadwal.armada', 'detailPemesanan', 'pembayaran']);

        return Inertia::render('admin/pemesanan/show', [
            'pemesanan' => $pemesanan,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pemesanan $pemesanan): Response
    {
        $pemesanan->load(['user', 'jadwal.rute', 'detailPemesanan']);

        return Inertia::render('admin/pemesanan/edit', [
            'pemesanan' => $pemesanan,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePemesananRequest $request, Pemesanan $pemesanan)
    {
        $pemesanan->update($request->validated());

        return redirect()->route('admin.pemesanan.index')
            ->with('success', 'Pemesanan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pemesanan $pemesanan)
    {
        $pemesanan->delete();

        return redirect()->route('admin.pemesanan.index')
            ->with('success', 'Pemesanan berhasil dihapus.');
    }
}
