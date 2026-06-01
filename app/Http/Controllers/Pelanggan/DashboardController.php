<?php

namespace App\Http\Controllers\Pelanggan;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\Pemesanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display pelanggan dashboard with statistics.
     */
    public function __invoke(Request $request): Response
    {
        $user = Auth::user();

        // Hapus otomatis data pemesanan yang sudah lewat waktu keberangkatan dan status pembayarannya bukan lunas
        $expiredBookings = Pemesanan::where('user_id', Auth::id())
            ->where('status_bayar', '!=', 'lunas')
            ->whereHas('jadwal', function ($query) {
                $query->whereRaw('CONCAT(tanggal_berangkat, " ", jam_berangkat) < ?', [now()]);
            })->get();

        foreach ($expiredBookings as $expired) {
            $expired->detailPemesanan()->delete();
            $expired->pembayaran()->delete();
            $expired->delete();
        }

        // Get customer's active bookings
        $pemesananAktif = Pemesanan::where('user_id', Auth::id())
            ->whereIn('status_bayar', ['pending', 'lunas'])
            ->whereHas('jadwal', function ($query) {
                $query->join('rute', 'jadwal.rute_id', '=', 'rute.id')
                      ->whereRaw('DATE_ADD(CONCAT(jadwal.tanggal_berangkat, " ", jadwal.jam_berangkat), INTERVAL rute.estimasi_waktu_jam HOUR) >= ?', [now()]);
            })
            ->with(['jadwal.rute', 'jadwal.armada', 'jadwal.supir', 'detailPemesanan'])
            ->orderBy('tanggal_pesan', 'desc')
            ->limit(5)
            ->get();

        // Get total counts
        $totalPemesanan = Pemesanan::where('user_id', Auth::id())->count();
        $pemesananPending = Pemesanan::where('user_id', Auth::id())
            ->where('status_bayar', 'pending')
            ->count();
        $pemesananLunas = Pemesanan::where('user_id', Auth::id())
            ->where('status_bayar', 'lunas')
            ->count();

        // Get available schedules count
        $jadwalTersedia = Jadwal::whereRaw('CONCAT(tanggal_berangkat, " ", jam_berangkat) >= ?', [now()])
            ->count();

        // Get completed trips
        $totalPerjalanan = Pemesanan::where('user_id', Auth::id())
            ->where('status_bayar', 'lunas')
            ->whereHas('jadwal', function ($query) {
                $query->join('rute', 'jadwal.rute_id', '=', 'rute.id')
                      ->whereRaw('DATE_ADD(CONCAT(jadwal.tanggal_berangkat, " ", jadwal.jam_berangkat), INTERVAL rute.estimasi_waktu_jam HOUR) < ?', [now()]);
            })
            ->count();

        // Get upcoming trips
        $perjalananAkanDatang = Pemesanan::where('user_id', Auth::id())
            ->where('status_bayar', 'lunas')
            ->whereHas('jadwal', function ($query) {
                $query->join('rute', 'jadwal.rute_id', '=', 'rute.id')
                      ->whereRaw('DATE_ADD(CONCAT(jadwal.tanggal_berangkat, " ", jadwal.jam_berangkat), INTERVAL rute.estimasi_waktu_jam HOUR) >= ?', [now()]);
            })
            ->count();

        // Get recent completed trips
        $perjalananSelesai = Pemesanan::where('user_id', Auth::id())
            ->where('status_bayar', 'lunas')
            ->whereHas('jadwal', function ($query) {
                $query->join('rute', 'jadwal.rute_id', '=', 'rute.id')
                      ->whereRaw('DATE_ADD(CONCAT(jadwal.tanggal_berangkat, " ", jadwal.jam_berangkat), INTERVAL rute.estimasi_waktu_jam HOUR) < ?', [now()]);
            })
            ->with(['jadwal.rute', 'jadwal.armada', 'detailPemesanan'])
            ->orderBy('tanggal_pesan', 'desc')
            ->limit(3)
            ->get();

        return Inertia::render('pelanggan/dashboard', [
            'user' => $user,
            'pemesananAktif' => $pemesananAktif,
            'totalPemesanan' => $totalPemesanan,
            'pemesananPending' => $pemesananPending,
            'pemesananLunas' => $pemesananLunas,
            'jadwalTersedia' => $jadwalTersedia,
            'totalPerjalanan' => $totalPerjalanan,
            'perjalananAkanDatang' => $perjalananAkanDatang,
            'perjalananSelesai' => $perjalananSelesai,
        ]);
    }
}
