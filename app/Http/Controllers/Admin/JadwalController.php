<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJadwalRequest;
use App\Http\Requests\UpdateJadwalRequest;
use App\Models\Armada;
use App\Models\Jadwal;
use App\Models\Rute;
use App\Models\Supir;
use Inertia\Inertia;
use Inertia\Response;

class JadwalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $jadwal = Jadwal::with(['rute', 'supir', 'armada'])
            ->orderBy('tanggal_berangkat', 'desc')
            ->orderBy('jam_berangkat', 'desc')
            ->paginate(10);

        return Inertia::render('admin/jadwal/index', [
            'jadwal' => $jadwal,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $rutes = Rute::all();
        $armada = Armada::with(['supir'])->get();

        return Inertia::render('admin/jadwal/create', [
            'rutes' => $rutes,
            'armada' => $armada,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJadwalRequest $request)
    {
        Jadwal::create($request->validated());

        return redirect()->route('admin.jadwal.index')
            ->with('success', 'Jadwal berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Jadwal $jadwal): Response
    {
        $jadwal->load(['rute', 'supir', 'armada']);

        return Inertia::render('admin/jadwal/show', [
            'jadwal' => $jadwal,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Jadwal $jadwal): Response
    {
        $jadwal->load(['rute', 'supir', 'armada']);
        $rutes = Rute::all();
        $armada = Armada::with(['supir'])->get();

        return Inertia::render('admin/jadwal/edit', [
            'jadwal' => $jadwal,
            'rutes' => $rutes,
            'armada' => $armada,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJadwalRequest $request, Jadwal $jadwal)
    {
        $jadwal->update($request->validated());

        return redirect()->route('admin.jadwal.index')
            ->with('success', 'Jadwal berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Jadwal $jadwal)
    {
        $jadwal->delete();

        return redirect()->route('admin.jadwal.index')
            ->with('success', 'Jadwal berhasil dihapus.');
    }
}
