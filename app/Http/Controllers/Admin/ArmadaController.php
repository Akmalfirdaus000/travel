<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArmadaRequest;
use App\Http\Requests\UpdateArmadaRequest;
use App\Models\Armada;
use App\Models\Supir;
use Inertia\Inertia;
use Inertia\Response;

class ArmadaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $armada = Armada::with(['supir'])->orderBy('id', 'desc')->paginate(10);

        return Inertia::render('admin/armada/index', [
            'armada' => $armada,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $assignedSupirs = Armada::whereNotNull('supir_id')->pluck('supir_id');
        $supirs = Supir::whereNotIn('id', $assignedSupirs)->get();

        return Inertia::render('admin/armada/create', [
            'supirs' => $supirs,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreArmadaRequest $request)
    {
        Armada::create($request->validated());

        return redirect()->route('admin.armada.index')
            ->with('success', 'Data armada berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Armada $armada): Response
    {
        $armada->load(['supir']);
        return Inertia::render('admin/armada/show', [
            'armada' => $armada,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Armada $armada): Response
    {
        $assignedSupirs = Armada::whereNotNull('supir_id')
            ->where('id', '!=', $armada->id)
            ->pluck('supir_id');
        $supirs = Supir::whereNotIn('id', $assignedSupirs)->get();

        return Inertia::render('admin/armada/edit', [
            'armada' => $armada,
            'supirs' => $supirs,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateArmadaRequest $request, Armada $armada)
    {
        $armada->update($request->validated());

        return redirect()->route('admin.armada.index')
            ->with('success', 'Data armada berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Armada $armada)
    {
        $armada->delete();

        return redirect()->route('admin.armada.index')
            ->with('success', 'Data armada berhasil dihapus.');
    }
}
