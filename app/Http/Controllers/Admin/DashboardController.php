<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Armada;
use App\Models\Jadwal;
use App\Models\Pemesanan;
use App\Models\Supir;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $now = now()->format('Y-m-d H:i:s');
        $today = now()->format('Y-m-d');

        // Statistik Umum (Shared)
        $total_pelanggan = User::where('role', 'pelanggan')->count();
        $total_armada = Armada::count();
        $total_supir = Supir::where('status', 'tersedia')->count();
        $tiket_pending = Pemesanan::where('status_bayar', 'pending')->count();
        $total_rute = \App\Models\Rute::count();
        $total_jadwal = Jadwal::count();

        // Armada Sedang Perjalanan
        $armada_jalan = Jadwal::with('rute')
            ->whereRaw('CONCAT(DATE(tanggal_berangkat), " ", jam_berangkat) <= ?', [$now])
            ->whereHas('rute', function ($query) use ($now) {
                $query->whereRaw('DATE_ADD(CONCAT(DATE(jadwal.tanggal_berangkat), " ", jadwal.jam_berangkat), INTERVAL rute.estimasi_waktu_jam HOUR) > ?', [$now]);
            })
            ->count();

        // Jika super_admin, siapkan data lengkap
        if ($user->role === 'super_admin') {
            $pemesananLunas = Pemesanan::where('status_bayar', 'lunas')->count();
            $pemesananBatal = Pemesanan::where('status_bayar', 'batal')->count();
            $totalPendapatan = Pemesanan::where('status_bayar', 'lunas')->sum('total_bayar');
            $pendapatanBulanIni = Pemesanan::where('status_bayar', 'lunas')
                ->whereMonth('tanggal_pesan', now()->month)
                ->whereYear('tanggal_pesan', now()->year)
                ->sum('total_bayar');

            // Data Grafik: Pendapatan 7 Hari Terakhir
            $last7Days = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i);
                $dateStr = $date->toDateString();
                $pendapatan = Pemesanan::where('status_bayar', 'lunas')
                    ->whereDate('tanggal_pesan', $dateStr)
                    ->sum('total_bayar');
                $last7Days[] = [
                    'name' => $date->format('d M'),
                    'pendapatan' => (int) $pendapatan,
                ];
            }

            // Data Grafik: Rute Terpopuler (Top 5)
            $topRutes = Pemesanan::where('status_bayar', 'lunas')
                ->whereHas('jadwal.rute')
                ->select('jadwal_id', \Illuminate\Support\Facades\DB::raw('COUNT(*) as total'))
                ->with('jadwal.rute')
                ->groupBy('jadwal_id')
                ->orderByDesc('total')
                ->limit(5)
                ->get()
                ->map(function ($item) {
                    return [
                        'name' => $item->jadwal->rute->kota_asal . ' - ' . $item->jadwal->rute->kota_tujuan,
                        'total' => $item->total,
                    ];
                });

            return Inertia::render('admin/dashboard', [
                'totalPelanggan' => $total_pelanggan,
                'totalSupir' => Supir::count(), // Total semua supir
                'totalRute' => $total_rute,
                'totalJadwal' => $total_jadwal,
                'totalPemesanan' => Pemesanan::count(),
                'pemesananPending' => $tiket_pending,
                'pemesananLunas' => $pemesananLunas,
                'pemesananBatal' => $pemesananBatal,
                'totalPendapatan' => $totalPendapatan,
                'pendapatanBulanIni' => $pendapatanBulanIni,
                'revenueData' => $last7Days,
                'popularRoutes' => $topRutes,
                'stats' => [
                    'total_armada' => $total_armada,
                ] // fallback for other components
            ]);
        }

        // Admin biasa
        $pendapatan_hari_ini = Pemesanan::where('status_bayar', 'lunas')
            ->whereDate('tanggal_pesan', $today)
            ->sum('total_bayar');

        return Inertia::render('admin/dashboard', [
            'totalSupir' => Supir::count(),
            'totalRute' => $total_rute,
            'totalJadwal' => $total_jadwal,
            'stats' => [
                'total_pelanggan' => $total_pelanggan,
                'total_armada' => $total_armada,
                'total_supir_tersedia' => $total_supir,
                'tiket_pending' => $tiket_pending,
                'armada_jalan' => $armada_jalan,
                'pendapatan_hari_ini' => $pendapatan_hari_ini,
            ]
        ]);
    }
}
