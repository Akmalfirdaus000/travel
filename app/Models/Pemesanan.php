<?php

namespace App\Models;

use Database\Factories\PemesananFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pemesanan extends Model
{
    /** @use HasFactory<PemesananFactory> */
    use HasFactory;

    protected $table = 'pemesanan';

    protected $fillable = [
        'user_id',
        'jadwal_id',
        'kode_booking',
        'total_bayar',
        'status_bayar',
        'tanggal_pesan',
    ];

    protected $casts = [
        'total_bayar' => 'decimal:2',
        'tanggal_pesan' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relasi ke user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke jadwal
     */
    public function jadwal(): BelongsTo
    {
        return $this->belongsTo(Jadwal::class);
    }

    /**
     * Relasi ke detail_pemesanan
     */
    public function detailPemesanan(): HasMany
    {
        return $this->hasMany(DetailPemesanan::class);
    }

    /**
     * Relasi ke pembayaran
     */
    public function pembayaran(): HasMany
    {
        return $this->hasMany(Pembayaran::class);
    }
}
