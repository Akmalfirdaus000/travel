<?php

namespace App\Http\Controllers\Pelanggan;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pelanggan\StorePemesananRequest;
use App\Models\DetailPemesanan;
use App\Models\Jadwal;
use App\Models\Pemesanan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PemesananController extends Controller
{
    /**
     * Display a listing of customer's bookings.
     */
    public function index(Request $request): Response
    {
        $pelanggan = Auth::user()->pelanggan;
        $tab = $request->query('tab', 'pesanan');

        $expiredBookings = Pemesanan::where('user_id', Auth::id())
            ->where('status_bayar', '!=', 'lunas')
            ->whereHas('jadwal', function ($query) {
                $query->where('tanggal_berangkat', '<', now()->toDateString())
                      ->orWhere(function ($q) {
                          $q->where('tanggal_berangkat', '=', now()->toDateString())
                            ->where('jam_berangkat', '<', now()->toTimeString());
                      });
            })->get();

        foreach ($expiredBookings as $expired) {
            $expired->detailPemesanan()->delete();
            $expired->pembayaran()->delete();
            $expired->delete();
        }

        $query = Pemesanan::where('user_id', Auth::id())
            ->with(['jadwal.rute', 'jadwal.armada', 'detailPemesanan', 'pembayaran'])
            ->orderBy('tanggal_pesan', 'desc');

        $pemesananList = $query->orderBy('tanggal_pesan', 'desc')->get()->filter(function ($pesanan) use ($tab) {
            $jadwal = $pesanan->jadwal;
            if (!$jadwal || !$jadwal->rute) return $tab !== 'riwayat';
            
            $jam = is_string($jadwal->jam_berangkat) ? $jadwal->jam_berangkat : (method_exists($jadwal->jam_berangkat, 'format') ? $jadwal->jam_berangkat->format('H:i:s') : explode(' ', (string)$jadwal->jam_berangkat)[1] ?? (string)$jadwal->jam_berangkat);
            $berangkat = \Carbon\Carbon::parse($jadwal->tanggal_berangkat->format('Y-m-d') . ' ' . $jam);
            $estimasi = $jadwal->rute->estimasi_waktu_jam ?? 0;
            $tiba = $berangkat->copy()->addHours($estimasi);
            
            if ($tab === 'riwayat') {
                return now() > $tiba && $pesanan->status_bayar === 'lunas';
            } else {
                return now() <= $tiba;
            }
        })->values();

        // Manual pagination
        $currentPage = \Illuminate\Pagination\Paginator::resolveCurrentPage();
        $perPage = 10;
        $pemesanan = new \Illuminate\Pagination\LengthAwarePaginator(
            $pemesananList->forPage($currentPage, $perPage),
            $pemesananList->count(),
            $perPage,
            $currentPage,
            ['path' => \Illuminate\Pagination\Paginator::resolveCurrentPath(), 'query' => request()->query()]
        );

        return Inertia::render('pelanggan/pemesanan/index', [
            'pemesanan' => $pemesanan,
            'tab' => $tab,
        ]);
    }

    /**
     * Show the form for creating a new booking.
     */
    public function create(Request $Request)
    {
        $jadwalId = $Request->input('jadwal_id');
        $kursiInput = $Request->input('kursi');

        // Convert string to array if needed
        $kursiTerpilih = is_array($kursiInput)
            ? $kursiInput
            : (empty($kursiInput) ? [] : array_map('intval', explode(',', $kursiInput)));

        if (! $jadwalId || empty($kursiTerpilih)) {
            return redirect()->route('pelanggan.jadwal.index')
                ->with('error', 'Silakan pilih jadwal dan kursi terlebih dahulu.');
        }

        $jadwal = Jadwal::with(['rute', 'supir', 'armada'])->findOrFail($jadwalId);

        // Validate seats are still available
        $bookedSeats = $jadwal->pemesanan()
            ->whereIn('status_bayar', ['pending', 'lunas'])
            ->whereHas('detailPemesanan')
            ->with('detailPemesanan')
            ->get()
            ->pluck('detailPemesanan')
            ->flatten()
            ->pluck('nomor_kursi')
            ->unique()
            ->values()
            ->toArray();

        $unavailable = array_intersect($kursiTerpilih, $bookedSeats);
        if (! empty($unavailable)) {
            return redirect()->route('pelanggan.jadwal.show', $jadwalId)
                ->with('error', 'Kursi '.implode(', ', $unavailable).' sudah dipesan. Silakan pilih kursi lain.');
        }

        $totalBayar = $jadwal->rute->harga_tiket * count($kursiTerpilih);

        return Inertia::render('pelanggan/pemesanan/create', [
            'jadwal' => $jadwal,
            'kursiTerpilih' => $kursiTerpilih,
            'totalBayar' => $totalBayar,
        ]);
    }

    /**
     * Store a newly created booking.
     */
    public function store(StorePemesananRequest $request): RedirectResponse
    {
        $jadwal = Jadwal::with('rute')->findOrFail($request->jadwal_id);

        // Generate booking code safely
        $latestBooking = Pemesanan::whereDate('created_at', today())->orderBy('id', 'desc')->first();
        $lastSequence = $latestBooking ? (int) substr($latestBooking->kode_booking, -3) : 0;
        $kodeBooking = 'BRN-'.date('Ymd').str_pad($lastSequence + 1, 3, '0', STR_PAD_LEFT);

        $pemesanan = Pemesanan::create([
            'user_id' => Auth::id(),
            'jadwal_id' => $request->jadwal_id,
            'kode_booking' => $kodeBooking,
            'total_bayar' => $jadwal->rute->harga_tiket * count($request->nomor_kursi),
            'status_bayar' => 'pending',
            'tanggal_pesan' => now(),
        ]);

        // Create detail pemesanan for each seat
        foreach ($request->nomor_kursi as $nomorKursi) {
            DetailPemesanan::create([
                'pemesanan_id' => $pemesanan->id,
                'nomor_kursi' => $nomorKursi,
            ]);
        }

        return redirect()->route('pelanggan.pemesanan.show', $pemesanan)
            ->with('success', 'Pemesanan berhasil dibuat. Silakan selesaikan pembayaran.');
    }

    /**
     * Display the specified booking.
     */
    public function show(Pemesanan $pemesanan): Response
    {
        // Ensure customer can only view their own bookings
        if ($pemesanan->user_id !== Auth::id()) {
            abort(403);
        }

        $pemesanan->load(['jadwal.rute', 'jadwal.supir', 'jadwal.armada', 'detailPemesanan', 'pembayaran', 'user.pelanggan']);

        return Inertia::render('pelanggan/pemesanan/show', [
            'pemesanan' => $pemesanan,
        ]);
    }

    /**
     * Cancel a booking.
     */
    public function cancel(Pemesanan $pemesanan): RedirectResponse
    {
        // Ensure customer can only cancel their own bookings
        if ($pemesanan->user_id !== Auth::id()) {
            abort(403);
        }

        // Can only cancel pending bookings
        if ($pemesanan->status_bayar === 'lunas') {
            return redirect()->route('pelanggan.pemesanan.show', $pemesanan)
                ->with('error', 'Tidak dapat membatalkan pemesanan yang sudah lunas.');
        }

        // Check if schedule is in the past or too soon
        $jadwal = $pemesanan->jadwal;
        $berangkat = $jadwal->tanggal_berangkat.' '.$jadwal->jam_berangkat;

        if (now()->gte($berangkat)) {
            return redirect()->route('pelanggan.pemesanan.show', $pemesanan)
                ->with('error', 'Tidak dapat membatalkan pemesanan yang sudah berangkat.');
        }

        $pemesanan->update(['status_bayar' => 'batal']);

        return redirect()->route('pelanggan.pemesanan.show', $pemesanan)
            ->with('success', 'Pemesanan berhasil dibatalkan.');
    }

    /**
     * Get booking details for print (ETicket).
     */
    public function eticket(Pemesanan $pemesanan): Response
    {
        // Ensure customer can only view their own bookings
        if ($pemesanan->user_id !== Auth::id()) {
            abort(403);
        }

        $pemesanan->load(['jadwal.rute', 'jadwal.supir', 'jadwal.armada', 'detailPemesanan', 'user.pelanggan']);

        return Inertia::render('pelanggan/pemesanan/eticket', [
            'pemesanan' => $pemesanan,
        ]);
    }
}
