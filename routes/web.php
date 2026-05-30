<?php

use App\Http\Controllers\Admin\ArmadaController;
use App\Http\Controllers\Admin\JadwalController;
use App\Http\Controllers\Admin\PelangganController;
use App\Http\Controllers\Admin\PembayaranController;
use App\Http\Controllers\Admin\PemesananController;
use App\Http\Controllers\Admin\RuteController;
use App\Http\Controllers\Admin\SupirController;
use App\Http\Controllers\Pelanggan\JadwalController as PelangganJadwalController;
use App\Http\Controllers\Pelanggan\PembayaranController as PelangganPembayaranController;
use App\Http\Controllers\Pelanggan\PemesananController as PelangganPemesananController;
use App\Http\Controllers\SuperAdmin\ReportController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'home')->name('home');

// Dashboard redirect based on role
Route::get('/dashboard', function () {
    $user = auth()->user();

    if (! $user) {
        return redirect()->route('login');
    }

    return match ($user->role) {
        'pelanggan' => redirect()->route('pelanggan.dashboard'),
        'admin' => redirect()->route('admin.dashboard'),
        'super_admin' => redirect()->route('admin.dashboard'),
        default => redirect()->route('home'),
    };
})->name('dashboard');

// Pelanggan routes (authenticated, role: pelanggan)
Route::middleware(['auth', 'verified', 'role:pelanggan'])->prefix('pelanggan')->name('pelanggan.')->group(function () {
    // Dashboard pelanggan
    Route::get('dashboard', fn () => inertia('pelanggan/dashboard'))->name('dashboard');

    // Jadwal routes
    Route::get('jadwal', [PelangganJadwalController::class, 'index'])->name('jadwal.index');
    Route::get('jadwal/{jadwal}', [PelangganJadwalController::class, 'show'])->name('jadwal.show');
    Route::get('jadwal/{jadwal}/seats', [PelangganJadwalController::class, 'getAvailableSeats'])->name('jadwal.seats');
    Route::get('rute/search', [PelangganJadwalController::class, 'searchRute'])->name('rute.search');

    // Pemesanan routes
    Route::get('pemesanan', [PelangganPemesananController::class, 'index'])->name('pemesanan.index');
    Route::get('pemesanan/create', [PelangganPemesananController::class, 'create'])->name('pemesanan.create');
    Route::post('pemesanan', [PelangganPemesananController::class, 'store'])->name('pemesanan.store');
    Route::get('pemesanan/{pemesanan}', [PelangganPemesananController::class, 'show'])->name('pemesanan.show');
    Route::post('pemesanan/{pemesanan}/cancel', [PelangganPemesananController::class, 'cancel'])->name('pemesanan.cancel');
    Route::get('pemesanan/{pemesanan}/eticket', [PelangganPemesananController::class, 'eticket'])->name('pemesanan.eticket');

    // Pembayaran routes
    Route::get('pembayaran/create/{pemesanan}', [PelangganPembayaranController::class, 'create'])->name('pembayaran.create');
    Route::post('pembayaran', [PelangganPembayaranController::class, 'store'])->name('pembayaran.store');
    Route::put('pembayaran/{pembayaran}', [PelangganPembayaranController::class, 'update'])->name('pembayaran.update');
    Route::get('pembayaran/{pembayaran}', [PelangganPembayaranController::class, 'show'])->name('pembayaran.show');
});

// Admin & Super Admin routes (authenticated, role: admin or super_admin)
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Middleware to check if user is admin or super_admin
    Route::group(['middleware' => function ($request, $next) {
        if (! in_array(auth()->user()?->role, ['admin', 'super_admin'])) {
            abort(403, 'Akses ditolak. Halaman ini khusus admin.');
        }

        return $next($request);
    }], function () {
        // Dashboard admin (both admin and super_admin can access)
        Route::get('dashboard', fn () => inertia('admin/dashboard'))->name('dashboard');

        // Resource Routes (both admin and super_admin can access)
        Route::resource('supir', SupirController::class);
        Route::resource('armada', ArmadaController::class);
        Route::resource('rute', RuteController::class);
        Route::resource('jadwal', JadwalController::class);
        Route::resource('pelanggan', PelangganController::class);
        Route::resource('pemesanan', PemesananController::class);
        Route::resource('pembayaran', PembayaranController::class);

        // Additional route for verifikasi pembayaran
        Route::post('pembayaran/{pembayaran}/verifikasi', [PembayaranController::class, 'verifikasi'])
            ->name('pembayaran.verifikasi');
    });
});

// Super Admin exclusive routes (authenticated, role: super_admin only)
Route::middleware(['auth', 'verified', 'role:super_admin'])->prefix('admin')->name('admin.')->group(function () {
    // Reports routes (only super_admin can access)
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('/pendapatan', [ReportController::class, 'pendapatan'])->name('pendapatan');
        Route::get('/pemesanan', [ReportController::class, 'pemesanan'])->name('pemesanan');
        Route::get('/rute-terpopuler', [ReportController::class, 'ruteTerpopuler'])->name('rute-terpopuler');
        Route::get('/supir-performa', [ReportController::class, 'supirPerforma'])->name('supir-performa');
        Route::get('/armada-utilisasi', [ReportController::class, 'armadaUtilisasi'])->name('armada-utilisasi');
        Route::get('/bulanan', [ReportController::class, 'bulanan'])->name('bulanan');
        Route::post('/export', [ReportController::class, 'export'])->name('export');
    });
});

require __DIR__.'/settings.php';
