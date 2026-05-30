<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\Pelanggan;
use App\Models\Pemesanan;
use App\Models\Rute;
use App\Models\Supir;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * Dashboard overview with statistics.
     */
    public function index(): Response
    {
        $totalPelanggan = Pelanggan::count();
        $totalSupir = Supir::count();
        $totalRute = Rute::count();
        $totalJadwal = Jadwal::count();

        $totalPemesanan = Pemesanan::count();
        $pemesananPending = Pemesanan::where('status_bayar', 'pending')->count();
        $pemesananLunas = Pemesanan::where('status_bayar', 'lunas')->count();
        $pemesananBatal = Pemesanan::where('status_bayar', 'batal')->count();

        $totalPendapatan = Pemesanan::where('status_bayar', 'lunas')->sum('total_bayar');
        $pendapatanBulanIni = Pemesanan::where('status_bayar', 'lunas')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total_bayar');

        $jadwalAkanDatang = Jadwal::where('tanggal_berangkat', '>=', today())->count();
        $jadwalSelesai = Jadwal::where('tanggal_berangkat', '<', today())->count();

        // Chart data for last 7 days
        $pemesananLast7Days = Pemesanan::where('created_at', '>=', now()->subDays(7))
            ->select(DB::raw('DATE(tanggal_pesan) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('count', 'date');

        $last7DaysLabels = [];
        $last7DaysData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $last7DaysLabels[] = now()->subDays($i)->format('d M');
            $last7DaysData[] = $pemesananLast7Days[$date] ?? 0;
        }

        // Top 5 popular routes
        $topRutes = Pemesanan::with('jadwal.rute')
            ->select('jadwal_id', DB::raw('COUNT(*) as total'))
            ->groupBy('jadwal_id')
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'rute' => $item->jadwal->rute->kota_asal.' >> '.$item->jadwal->rute->kota_tujuan,
                    'total' => $item->total,
                ];
            });

        return Inertia::render('superadmin/reports/index', [
            'totalPelanggan' => $totalPelanggan,
            'totalSupir' => $totalSupir,
            'totalRute' => $totalRute,
            'totalJadwal' => $totalJadwal,
            'totalPemesanan' => $totalPemesanan,
            'pemesananPending' => $pemesananPending,
            'pemesananLunas' => $pemesananLunas,
            'pemesananBatal' => $pemesananBatal,
            'totalPendapatan' => $totalPendapatan,
            'pendapatanBulanIni' => $pendapatanBulanIni,
            'jadwalAkanDatang' => $jadwalAkanDatang,
            'jadwalSelesai' => $jadwalSelesai,
            'last7DaysLabels' => $last7DaysLabels,
            'last7DaysData' => $last7DaysData,
            'topRutes' => $topRutes,
        ]);
    }

    /**
     * Laporan pendapatan.
     */
    public function pendapatan(Request $request): Response
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

        $pendapatan = Pemesanan::where('status_bayar', 'lunas')
            ->whereBetween('tanggal_pesan', [$startDate, $endDate])
            ->with(['jadwal.rute', 'user.pelanggan'])
            ->orderBy('tanggal_pesan', 'desc')
            ->get();

        $totalPendapatan = $pendapatan->sum('total_bayar');
        $totalTransaksi = $pendapatan->count();

        // Group by date
        $pendapatanPerHari = $pendapatan->groupBy(function ($item) {
            return $item->tanggal_pesan->format('Y-m-d');
        })->map(function ($item) {
            return $item->sum('total_bayar');
        })->sortKeys();

        return Inertia::render('superadmin/reports/pendapatan', [
            'pendapatan' => $pendapatan,
            'totalPendapatan' => $totalPendapatan,
            'totalTransaksi' => $totalTransaksi,
            'pendapatanPerHari' => $pendapatanPerHari,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    /**
     * Laporan pemesanan.
     */
    public function pemesanan(Request $request): Response
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());
        $status = $request->input('status', 'all');

        $query = Pemesanan::whereBetween('tanggal_pesan', [$startDate, $endDate])
            ->with(['jadwal.rute', 'jadwal.armada', 'jadwal.supir', 'user.pelanggan']);

        if ($status !== 'all') {
            $query->where('status_bayar', $status);
        }

        $pemesanan = $query->orderBy('tanggal_pesan', 'desc')->paginate(20);

        $totalPending = (clone $query)->where('status_bayar', 'pending')->count();
        $totalLunas = (clone $query)->where('status_bayar', 'lunas')->count();
        $totalBatal = (clone $query)->where('status_bayar', 'batal')->count();

        return Inertia::render('superadmin/reports/pemesanan', [
            'pemesanan' => $pemesanan,
            'totalPending' => $totalPending,
            'totalLunas' => $totalLunas,
            'totalBatal' => $totalBatal,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Laporan rute terpopuler.
     */
    public function ruteTerpopuler(Request $request): Response
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

        $ruteStats = Pemesanan::where('status_bayar', '!=', 'batal')
            ->whereBetween('tanggal_pesan', [$startDate, $endDate])
            ->whereHas('jadwal.rute')
            ->select(
                'jadwal_id',
                DB::raw('COUNT(*) as total_pemesanan'),
                DB::raw('SUM(total_bayar) as total_pendapatan')
            )
            ->with('jadwal.rute')
            ->groupBy('jadwal_id')
            ->orderByDesc('total_pemesanan')
            ->get();

        return Inertia::render('superadmin/reports/rute-terpopuler', [
            'ruteStats' => $ruteStats,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    /**
     * Laporan performa supir.
     */
    public function supirPerforma(Request $request): Response
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

        $supirStats = Jadwal::whereBetween('tanggal_berangkat', [$startDate, $endDate])
            ->with('supir')
            ->select(
                'supir_id',
                DB::raw('COUNT(*) as total_jadwal'),
                DB::raw('SUM(CASE WHEN tanggal_berangkat < NOW() THEN 1 ELSE 0 END) as jadwal_selesai')
            )
            ->groupBy('supir_id')
            ->get()
            ->map(function ($item) {
                $persentase = $item->total_jadwal > 0
                    ? round(($item->jadwal_selesai / $item->total_jadwal) * 100, 2)
                    : 0;

                return [
                    'nama_supir' => $item->supir->nama_supir,
                    'total_jadwal' => $item->total_jadwal,
                    'jadwal_selesai' => $item->jadwal_selesai,
                    'persentase' => $persentase,
                ];
            });

        return Inertia::render('superadmin/reports/supir-performa', [
            'supirStats' => $supirStats,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    /**
     * Laporan utilisasi armada.
     */
    public function armadaUtilisasi(Request $request): Response
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

        $armadaStats = Jadwal::whereBetween('tanggal_berangkat', [$startDate, $endDate])
            ->with('armada')
            ->select(
                'armada_id',
                DB::raw('COUNT(*) as total_jadwal'),
                DB::raw('COUNT(DISTINCT tanggal_berangkat) as total_hari')
            )
            ->groupBy('armada_id')
            ->get()
            ->map(function ($item) {
                return [
                    'plat_nomor' => $item->armada->plat_nomor,
                    'tipe_mobil' => $item->armada->tipe_mobil,
                    'total_jadwal' => $item->total_jadwal,
                    'total_hari' => $item->total_hari,
                ];
            });

        return Inertia::render('superadmin/reports/armada-utilisasi', [
            'armadaStats' => $armadaStats,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    /**
     * Laporan bulanan (summary).
     */
    public function bulanan(Request $request): Response
    {
        $year = $request->input('year', now()->year);

        $monthlyStats = Pemesanan::where('status_bayar', 'lunas')
            ->whereYear('created_at', $year)
            ->select(
                DB::raw('MONTH(tanggal_pesan) as month'),
                DB::raw('COUNT(*) as total_pemesanan'),
                DB::raw('SUM(total_bayar) as total_pendapatan')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $monthlyData = [];
        for ($i = 1; $i <= 12; $i++) {
            $data = $monthlyStats->firstWhere('month', $i);
            $monthlyData[] = [
                'bulan' => date('F', mktime(0, 0, 0, $i, 1)),
                'total_pemesanan' => $data ? $data->total_pemesanan : 0,
                'total_pendapatan' => $data ? $data->total_pendapatan : 0,
            ];
        }

        $totalPendapatanTahun = Pemesanan::where('status_bayar', 'lunas')
            ->whereYear('created_at', $year)
            ->sum('total_bayar');

        return Inertia::render('superadmin/reports/bulanan', [
            'monthlyData' => $monthlyData,
            'year' => $year,
            'totalPendapatanTahun' => $totalPendapatanTahun,
        ]);
    }

    /**
     * Export report to PDF/Excel placeholder.
     */
    public function export(Request $request): array
    {
        $type = $request->input('type', 'pendapatan');
        $format = $request->input('format', 'pdf');

        // TODO: Implement export functionality
        return [
            'message' => 'Export functionality will be implemented.',
            'type' => $type,
            'format' => $format,
        ];
    }
}
