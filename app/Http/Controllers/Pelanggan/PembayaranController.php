<?php

namespace App\Http\Controllers\Pelanggan;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pelanggan\StorePembayaranRequest;
use App\Models\Pembayaran;
use App\Models\Pemesanan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PembayaranController extends Controller
{
    /**
     * Show the form for uploading payment proof.
     */
    public function create(Pemesanan $pemesanan)
    {
        // Ensure customer can only pay for their own bookings
        if ($pemesanan->user_id !== Auth::id()) {
            abort(403);
        }

        // Check if payment already exists
        if ($pemesanan->pembayaran) {
            return redirect()->route('pelanggan.pemesanan.show', $pemesanan)
                ->with('info', 'Bukti pembayaran sudah diunggah. Menunggu verifikasi admin.');
        }

        // Can only pay for pending bookings
        if ($pemesanan->status_bayar === 'lunas') {
            return redirect()->route('pelanggan.pemesanan.show', $pemesanan)
                ->with('success', 'Pemesanan sudah lunas.');
        }

        if ($pemesanan->status_bayar === 'batal') {
            return redirect()->route('pelanggan.pemesanan.show', $pemesanan)
                ->with('error', 'Tidak dapat membayar untuk pemesanan yang dibatalkan.');
        }

        return Inertia::render('pelanggan/pembayaran/create', [
            'pemesanan' => $pemesanan,
        ]);
    }

    /**
     * Store payment proof.
     */
    public function store(StorePembayaranRequest $request): RedirectResponse
    {
        $pemesanan = Pemesanan::findOrFail($request->pemesanan_id);

        // Ensure customer can only pay for their own bookings
        if ($pemesanan->user_id !== Auth::id()) {
            abort(403);
        }

        // Check if payment already exists
        if ($pemesanan->pembayaran) {
            return redirect()->route('pelanggan.pemesanan.show', $pemesanan)
                ->with('info', 'Bukti pembayaran sudah diunggah. Menunggu verifikasi admin.');
        }

        // Upload bukti transfer
        $buktiTransfer = null;
        if ($request->hasFile('bukti_transfer')) {
            $buktiTransfer = $request->file('bukti_transfer')->store('bukti_transfer', 'public');
        }

        Pembayaran::create([
            'pemesanan_id' => $pemesanan->id,
            'bukti_transfer' => $buktiTransfer,
            'tanggal_transfer' => now(),
        ]);

        return redirect()->route('pelanggan.pemesanan.show', $pemesanan)
            ->with('success', 'Bukti pembayaran berhasil diunggah. Menunggu verifikasi admin.');
    }

    /**
     * Update payment proof (re-upload).
     */
    public function update(StorePembayaranRequest $request): RedirectResponse
    {
        $pembayaran = Pembayaran::with('pemesanan')->findOrFail($request->pembayaran_id);

        // Ensure customer can only update their own payments
        if ($pembayaran->pemesanan->user_id !== Auth::id()) {
            abort(403);
        }

        // Can only update pending payments
        if ($pembayaran->pemesanan->status_bayar === 'lunas') {
            return redirect()->route('pelanggan.pemesanan.show', $pembayaran->pemesanan)
                ->with('info', 'Pembayaran sudah diverifikasi.');
        }

        // Delete old proof
        if ($pembayaran->bukti_transfer) {
            Storage::disk('public')->delete($pembayaran->bukti_transfer);
        }

        // Upload new proof
        if ($request->hasFile('bukti_transfer')) {
            $pembayaran->bukti_transfer = $request->file('bukti_transfer')->store('bukti_transfer', 'public');
            $pembayaran->tanggal_transfer = now();
            $pembayaran->save();
        }

        return redirect()->route('pelanggan.pemesanan.show', $pembayaran->pemesanan)
            ->with('success', 'Bukti pembayaran berhasil diperbarui. Menunggu verifikasi admin.');
    }

    /**
     * Show payment details.
     */
    public function show(Pembayaran $pembayaran): Response
    {
        // Ensure customer can only view their own payments
        if ($pembayaran->pemesanan->user_id !== Auth::id()) {
            abort(403);
        }

        $pembayaran->load(['pemesanan.jadwal.rute', 'pemesanan.user.pelanggan']);

        return Inertia::render('pelanggan/pembayaran/show', [
            'pembayaran' => $pembayaran,
        ]);
    }
}
