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
     * Display customer's payment history.
     */
    public function index(): Response
    {
        $pembayaran = Pembayaran::with(['pemesanan.jadwal.rute', 'pemesanan.jadwal.armada'])
            ->whereHas('pemesanan', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('pelanggan/pembayaran/index', [
            'pembayaran' => $pembayaran,
        ]);
    }

    /**
     * Show the form for uploading payment proof.
     */
    public function create(Pemesanan $pemesanan)
    {
        // Ensure customer can only pay for their own bookings
        if ($pemesanan->user_id !== Auth::id()) {
            abort(403);
        }

        // Can only pay for pending bookings
        if ($pemesanan->status_bayar === 'lunas') {
            return redirect()->route('pelanggan.pemesanan.show', $pemesanan)
                ->with('info', 'Pemesanan sudah lunas.');
        }

        if ($pemesanan->status_bayar === 'batal') {
            return redirect()->route('pelanggan.pemesanan.show', $pemesanan)
                ->with('error', 'Tidak dapat membayar untuk pemesanan yang dibatalkan.');
        }

        $existingPayment = $pemesanan->pembayaran;

        return Inertia::render('pelanggan/pembayaran/create', [
            'pemesanan' => $pemesanan->load('jadwal.rute'),
            'existingPayment' => $existingPayment ? true : false,
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
