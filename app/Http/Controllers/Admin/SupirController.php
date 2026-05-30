<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSupirRequest;
use App\Http\Requests\UpdateSupirRequest;
use App\Models\Supir;
use Inertia\Inertia;
use Inertia\Response;

class SupirController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $supir = Supir::orderBy('id', 'desc')->paginate(10);

        return Inertia::render('admin/supir/index', [
            'supir' => $supir,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/supir/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSupirRequest $request)
    {
        Supir::create($request->validated());

        return redirect()->route('admin.supir.index')
            ->with('success', 'Data supir berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Supir $supir): Response
    {
        return Inertia::render('admin/supir/show', [
            'supir' => $supir,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Supir $supir): Response
    {
        return Inertia::render('admin/supir/edit', [
            'supir' => $supir,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSupirRequest $request, Supir $supir)
    {
        $supir->update($request->validated());

        return redirect()->route('admin.supir.index')
            ->with('success', 'Data supir berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supir $supir)
    {
        $supir->delete();

        return redirect()->route('admin.supir.index')
            ->with('success', 'Data supir berhasil dihapus.');
    }
}
