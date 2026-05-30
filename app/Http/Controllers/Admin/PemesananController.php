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
        $pemesanan = Pemesanan::with(['user', 'jadwal.rute', 'jadwal.supir', 'jadwal.armada'])
            ->orderBy('tanggal_pesan', 'desc')
            ->paginate(10);

        return Inertia::render('admin/pemesanan/index', [
            'pemesanan' => $pemesanan,
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
        $kodeBooking = 'BRN-'.date('Ymd').str_pad(Pemesanan::count() + 1, 3, '0', STR_PAD_LEFT);

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
