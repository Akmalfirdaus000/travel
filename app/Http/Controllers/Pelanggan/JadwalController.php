<?php

namespace App\Http\Controllers\Pelanggan;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\Rute;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JadwalController extends Controller
{
    /**
     * Display a listing of available schedules.
     */
    public function index(Request $request): Response
    {
        $query = Jadwal::with(['rute', 'armada', 'supir'])
            ->whereRaw('CONCAT(DATE(tanggal_berangkat), " ", jam_berangkat) >= ?', [now()->format('Y-m-d H:i:s')])
            ->orderBy('tanggal_berangkat', 'asc')
            ->orderBy('jam_berangkat', 'asc');

        // Filter by rute if selected
        if ($request->has('rute_id') && $request->rute_id) {
            $query->where('rute_id', $request->rute_id);
        }

        // Filter by kota asal
        if ($request->has('kota_asal') && $request->kota_asal) {
            $ruteIds = Rute::where('kota_asal', 'like', '%'.$request->kota_asal.'%')->pluck('id');
            $query->whereIn('rute_id', $ruteIds);
        }

        // Filter by kota tujuan
        if ($request->has('kota_tujuan') && $request->kota_tujuan) {
            $ruteIds = Rute::where('kota_tujuan', 'like', '%'.$request->kota_tujuan.'%')->pluck('id');
            $query->whereIn('rute_id', $ruteIds);
        }

        // Filter by tanggal
        if ($request->has('tanggal') && $request->tanggal) {
            $query->where('tanggal_berangkat', $request->tanggal);
        }

        $jadwal = $query->paginate(12);

        // Add available seats count for each schedule
        $jadwal->getCollection()->transform(function ($item) {
            $bookedSeats = $item->pemesanan()
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

            $item->available_seats = $item->armada->kapasitas_kursi - count($bookedSeats);

            return $item;
        });

        $rute = Rute::all();

        return Inertia::render('pelanggan/jadwal/index', [
            'jadwal' => $jadwal,
            'rute' => $rute,
            'filters' => $request->only(['rute_id', 'kota_asal', 'kota_tujuan', 'tanggal']),
        ]);
    }

    /**
     * Display the specified schedule.
     */
    public function show(Jadwal $jadwal): Response
    {
        $departureDateTime = \Carbon\Carbon::parse($jadwal->tanggal_berangkat->format('Y-m-d') . ' ' . $jadwal->jam_berangkat->format('H:i:s'));
        if ($departureDateTime->isPast()) {
            abort(404, 'Jadwal perjalanan ini sudah tidak tersedia.');
        }

        $jadwal->load(['rute', 'supir', 'armada']);

        // Get booked seats for this schedule
        $bookedSeats = $jadwal->pemesanan()
            ->whereHas('detailPemesanan')
            ->with('detailPemesanan')
            ->get()
            ->pluck('detailPemesanan')
            ->flatten()
            ->pluck('nomor_kursi')
            ->unique()
            ->values()
            ->sort()
            ->toArray();

        $availableSeats = [];
        for ($i = 1; $i <= $jadwal->armada->kapasitas_kursi; $i++) {
            $availableSeats[] = [
                'nomor' => $i,
                'tersedia' => ! in_array($i, $bookedSeats),
            ];
        }

        return Inertia::render('pelanggan/jadwal/show', [
            'jadwal' => $jadwal,
            'availableSeats' => $availableSeats,
        ]);
    }

    /**
     * Get available seats for a schedule (AJAX).
     */
    public function getAvailableSeats(Jadwal $jadwal): array
    {
        $jadwal->load('armada');

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

        $allSeats = range(1, $jadwal->armada->kapasitas_kursi);
        $available = array_diff($allSeats, $bookedSeats);

        return [
            'available' => array_values($available),
            'total' => count($available),
            'harga_tiket' => $jadwal->rute->harga_tiket,
        ];
    }

    /**
     * Search routes by city.
     */
    public function searchRute(Request $request): array
    {
        $query = $request->get('q');

        $rute = Rute::where('kota_asal', 'like', '%'.$query.'%')
            ->orWhere('kota_tujuan', 'like', '%'.$query.'%')
            ->get(['id', 'kota_asal', 'kota_tujuan', 'harga_tiket'])
            ->map(function ($item) {
                $arrow = '>>';

                return [
                    'id' => $item->id,
                    'text' => $item->kota_asal.' '.$arrow.' '.$item->kota_tujuan.' (Rp '.number_format($item->harga_tiket, 0, ',', '.').')',
                ];
            });

        return ['results' => $rute->toArray()];
    }
}
