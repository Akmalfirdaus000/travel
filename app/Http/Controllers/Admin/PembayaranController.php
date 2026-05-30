<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePembayaranRequest;
use App\Http\Requests\UpdatePembayaranRequest;
use App\Models\Pembayaran;
use App\Models\Pemesanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PembayaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $pembayaran = Pembayaran::with(['pemesanan.user', 'pemesanan.jadwal.rute'])
            ->orderBy('tanggal_transfer', 'desc')
            ->paginate(10);

        return Inertia::render('admin/pembayaran/index', [
            'pembayaran' => $pembayaran,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $pemesanan = Pemesanan::where('status_bayar', 'pending')
            ->with('jadwal.rute')
            ->get();

        return Inertia::render('admin/pembayaran/create', [
            'pemesanan' => $pemesanan,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePembayaranRequest $request)
    {
        $buktiTransfer = null;

        if ($request->hasFile('bukti_transfer')) {
            $buktiTransfer = $request->file('bukti_transfer')->store('bukti_transfer', 'public');
        }

        Pembayaran::create([
            'pemesanan_id' => $request->pemesanan_id,
            'bukti_transfer' => $buktiTransfer,
            'tanggal_transfer' => now(),
        ]);

        $pemesanan = Pemesanan::findOrFail($request->pemesanan_id);
        $pemesanan->update(['status_bayar' => 'pending']);

        return redirect()->route('admin.pembayaran.index')
            ->with('success', 'Bukti pembayaran berhasil diunggah.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Pembayaran $pembayaran): Response
    {
        $pembayaran->load(['pemesanan.user', 'pemesanan.jadwal.rute']);

        return Inertia::render('admin/pembayaran/show', [
            'pembayaran' => $pembayaran,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pembayaran $pembayaran): Response
    {
        $pembayaran->load('pemesanan');

        return Inertia::render('admin/pembayaran/edit', [
            'pembayaran' => $pembayaran,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePembayaranRequest $request, Pembayaran $pembayaran)
    {
        if ($request->hasFile('bukti_transfer')) {
            if ($pembayaran->bukti_transfer) {
                Storage::disk('public')->delete($pembayaran->bukti_transfer);
            }
            $pembayaran->bukti_transfer = $request->file('bukti_transfer')->store('bukti_transfer', 'public');
        }

        if ($request->has('status_bayar')) {
            $pembayaran->pemesanan->update(['status_bayar' => $request->status_bayar]);
        }

        $pembayaran->save();

        return redirect()->route('admin.pembayaran.index')
            ->with('success', 'Pembayaran berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pembayaran $pembayaran)
    {
        if ($pembayaran->bukti_transfer) {
            Storage::disk('public')->delete($pembayaran->bukti_transfer);
        }

        $pembayaran->delete();

        return redirect()->route('admin.pembayaran.index')
            ->with('success', 'Pembayaran berhasil dihapus.');
    }

    /**
     * Verifikasi pembayaran
     */
    public function verifikasi(Request $request, Pembayaran $pembayaran)
    {
        $request->validate(['status_bayar' => 'required|in:pending,lunas,batal']);

        $pembayaran->pemesanan->update(['status_bayar' => $request->status_bayar]);

        return redirect()->route('admin.pembayaran.index')
            ->with('success', 'Status pembayaran berhasil diperbarui.');
    }
}
