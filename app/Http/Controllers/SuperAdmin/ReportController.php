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
            ->whereBetween('tanggal_pesan', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
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

        $query = Pemesanan::whereBetween('tanggal_pesan', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
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
            ->whereBetween('tanggal_pesan', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
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

        $supirStats = DB::table('jadwal')
            ->join('armada', 'jadwal.armada_id', '=', 'armada.id')
            ->join('supir', 'armada.supir_id', '=', 'supir.id')
            ->whereBetween('jadwal.tanggal_berangkat', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->select(
                'supir.id as supir_id',
                'supir.nama_supir',
                DB::raw('COUNT(jadwal.id) as total_jadwal'),
                DB::raw('SUM(CASE WHEN jadwal.tanggal_berangkat < NOW() THEN 1 ELSE 0 END) as jadwal_selesai')
            )
            ->groupBy('supir.id', 'supir.nama_supir')
            ->get()
            ->map(function ($item) {
                $persentase = $item->total_jadwal > 0
                    ? round(($item->jadwal_selesai / $item->total_jadwal) * 100, 2)
                    : 0;

                return [
                    'nama_supir' => $item->nama_supir,
                    'total_jadwal' => (int) $item->total_jadwal,
                    'jadwal_selesai' => (int) $item->jadwal_selesai,
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

        $armadaStats = Jadwal::whereBetween('tanggal_berangkat', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
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

    public function export(Request $request)
    {
        $type = $request->input('type', 'pendapatan');
        
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());
        
        $table = '';
        $summary = [];
        $title = 'Laporan';
        
        if ($type === 'pendapatan') {
            $title = 'Laporan Pendapatan';
            $pendapatan = Pemesanan::with(['user', 'jadwal.rute'])
                ->where('status_bayar', 'lunas')
                ->whereBetween('tanggal_pesan', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->orderByDesc('tanggal_pesan')
                ->get();
            
            $summary = [
                'Total Pendapatan (Rp)' => $pendapatan->sum('total_bayar'),
                'Total Transaksi' => $pendapatan->count(),
            ];
            
            $table = '<table><thead><tr><th>Kode Booking</th><th>Tanggal</th><th>Pelanggan</th><th>Rute</th><th class="text-right">Nominal</th></tr></thead><tbody>';
            foreach ($pendapatan as $item) {
                $table .= '<tr><td>' . $item->kode_booking . '</td><td>' . $item->tanggal_pesan->format('d M Y H:i') . '</td><td>' . $item->user->name . '</td><td>' . $item->jadwal->rute->kota_asal . ' - ' . $item->jadwal->rute->kota_tujuan . '</td><td class="text-right">Rp ' . number_format($item->total_bayar, 0, ',', '.') . '</td></tr>';
            }
            $table .= '</tbody></table>';
        } elseif ($type === 'pemesanan') {
            $title = 'Laporan Pemesanan';
            $status = $request->input('status', 'all');
            
            $query = Pemesanan::with(['user', 'jadwal.rute'])
                ->whereBetween('tanggal_pesan', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->orderByDesc('tanggal_pesan');
                
            if ($status !== 'all') {
                $query->where('status_bayar', $status);
            }
            
            $pemesanan = $query->get();
            
            $summary = [
                'Total Pesanan' => $pemesanan->count(),
                'Total Nominal (Rp)' => $pemesanan->sum('total_bayar'),
            ];
            
            $table = '<table><thead><tr><th>Kode Booking</th><th>Waktu</th><th>Pelanggan</th><th>Rute</th><th>Nominal</th><th>Status</th></tr></thead><tbody>';
            foreach ($pemesanan as $item) {
                $table .= '<tr><td>' . $item->kode_booking . '</td><td>' . $item->tanggal_pesan->format('d M Y H:i') . '</td><td>' . $item->user->name . '</td><td>' . $item->jadwal->rute->kota_asal . ' - ' . $item->jadwal->rute->kota_tujuan . '</td><td>Rp ' . number_format($item->total_bayar, 0, ',', '.') . '</td><td>' . strtoupper($item->status_bayar) . '</td></tr>';
            }
            $table .= '</tbody></table>';
        } elseif ($type === 'rute-terpopuler') {
            $title = 'Laporan Rute Terpopuler';
            $ruteStats = Pemesanan::where('status_bayar', '!=', 'batal')
                ->whereBetween('tanggal_pesan', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
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
                
            $summary = [
                'Total Rute Aktif' => $ruteStats->count(),
                'Total Pemesanan' => $ruteStats->sum('total_pemesanan'),
                'Total Pendapatan (Rp)' => $ruteStats->sum('total_pendapatan'),
            ];
            
            $table = '<table><thead><tr><th>Peringkat</th><th>Rute</th><th>Total Pesanan</th><th class="text-right">Total Pendapatan</th></tr></thead><tbody>';
            foreach ($ruteStats as $index => $item) {
                $rute = $item->jadwal->rute;
                $table .= '<tr><td>' . ($index + 1) . '</td><td>' . $rute->kota_asal . ' - ' . $rute->kota_tujuan . '</td><td>' . $item->total_pemesanan . '</td><td class="text-right">Rp ' . number_format($item->total_pendapatan, 0, ',', '.') . '</td></tr>';
            }
            $table .= '</tbody></table>';
        } elseif ($type === 'supir-performa') {
            $title = 'Laporan Performa Supir';
            $supirStats = DB::table('jadwal')
                ->join('armada', 'jadwal.armada_id', '=', 'armada.id')
                ->join('supir', 'armada.supir_id', '=', 'supir.id')
                ->whereBetween('jadwal.tanggal_berangkat', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->select(
                    'supir.id as supir_id',
                    'supir.nama_supir',
                    DB::raw('COUNT(jadwal.id) as total_jadwal'),
                    DB::raw('SUM(CASE WHEN jadwal.tanggal_berangkat < NOW() THEN 1 ELSE 0 END) as jadwal_selesai')
                )
                ->groupBy('supir.id', 'supir.nama_supir')
                ->get();
                
            $table = '<table><thead><tr><th>Nama Supir</th><th>Total Ditugaskan</th><th>Selesai</th><th>Belum Selesai</th><th>Tingkat Penyelesaian</th></tr></thead><tbody>';
            foreach ($supirStats as $item) {
                $persen = $item->total_jadwal > 0 ? round(($item->jadwal_selesai / $item->total_jadwal) * 100, 2) : 0;
                $belum = $item->total_jadwal - $item->jadwal_selesai;
                $table .= '<tr><td>' . $item->nama_supir . '</td><td>' . $item->total_jadwal . '</td><td>' . $item->jadwal_selesai . '</td><td>' . $belum . '</td><td>' . $persen . '%</td></tr>';
            }
            $table .= '</tbody></table>';
        } elseif ($type === 'armada-utilisasi') {
            $title = 'Laporan Utilisasi Armada';
            $armadaStats = Jadwal::whereBetween('tanggal_berangkat', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                ->with('armada')
                ->select(
                    'armada_id',
                    DB::raw('COUNT(*) as total_jadwal'),
                    DB::raw('COUNT(DISTINCT tanggal_berangkat) as total_hari')
                )
                ->groupBy('armada_id')
                ->get();
                
            $table = '<table><thead><tr><th>Plat Nomor</th><th>Tipe Mobil</th><th>Total Hari Beroperasi</th><th>Total Trip</th><th>Rata-rata Trip/Hari</th></tr></thead><tbody>';
            foreach ($armadaStats as $item) {
                $avg = $item->total_hari > 0 ? number_format($item->total_jadwal / $item->total_hari, 1) : '0.0';
                $table .= '<tr><td>' . $item->armada->plat_nomor . '</td><td>' . $item->armada->tipe_mobil . '</td><td>' . $item->total_hari . ' Hari</td><td>' . $item->total_jadwal . '</td><td>' . $avg . '</td></tr>';
            }
            $table .= '</tbody></table>';
        } elseif ($type === 'bulanan') {
            $year = $request->input('year', date('Y'));
            $title = 'Laporan Rekapitulasi Bulanan ' . $year;
            $monthlyData = [];
            
            for ($month = 1; $month <= 12; $month++) {
                $start = \Carbon\Carbon::create($year, $month, 1)->startOfMonth();
                $end = \Carbon\Carbon::create($year, $month, 1)->endOfMonth();
    
                $stats = Pemesanan::where('status_bayar', 'lunas')
                    ->whereBetween('tanggal_pesan', [$start, $end])
                    ->select(
                        DB::raw('COUNT(*) as total_pemesanan'),
                        DB::raw('SUM(total_bayar) as total_pendapatan')
                    )
                    ->first();
    
                $monthlyData[] = [
                    'bulan' => $start->translatedFormat('F'),
                    'total_pemesanan' => $stats->total_pemesanan ?? 0,
                    'total_pendapatan' => $stats->total_pendapatan ?? 0,
                ];
            }
            
            $table = '<table><thead><tr><th>Bulan</th><th>Total Pemesanan</th><th class="text-right">Total Pendapatan</th></tr></thead><tbody>';
            foreach ($monthlyData as $item) {
                $table .= '<tr><td>' . $item['bulan'] . '</td><td>' . $item['total_pemesanan'] . '</td><td class="text-right">Rp ' . number_format($item['total_pendapatan'], 0, ',', '.') . '</td></tr>';
            }
            $table .= '</tbody></table>';
        }
        
        $html = view('exports.report', compact('title', 'summary', 'table'))->render();
        return response($html)
            ->header('Content-Type', 'text/html')
            ->header('Content-Disposition', 'attachment; filename="laporan-'.$type.'.html"');
    }
}
