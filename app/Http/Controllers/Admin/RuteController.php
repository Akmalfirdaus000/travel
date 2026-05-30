<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRuteRequest;
use App\Http\Requests\UpdateRuteRequest;
use App\Models\Rute;
use Inertia\Inertia;
use Inertia\Response;

class RuteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $rute = Rute::orderBy('id', 'desc')->paginate(10);

        return Inertia::render('admin/rute/index', [
            'rute' => $rute,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/rute/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRuteRequest $request)
    {
        Rute::create($request->validated());

        return redirect()->route('admin.rute.index')
            ->with('success', 'Data rute berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Rute $rute): Response
    {
        return Inertia::render('admin/rute/show', [
            'rute' => $rute,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Rute $rute): Response
    {
        return Inertia::render('admin/rute/edit', [
            'rute' => $rute,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRuteRequest $request, Rute $rute)
    {
        $rute->update($request->validated());

        return redirect()->route('admin.rute.index')
            ->with('success', 'Data rute berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rute $rute)
    {
        $rute->delete();

        return redirect()->route('admin.rute.index')
            ->with('success', 'Data rute berhasil dihapus.');
    }
}
