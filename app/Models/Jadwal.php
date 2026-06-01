<?php

namespace App\Models;

use Database\Factories\JadwalFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Jadwal extends Model
{
    /** @use HasFactory<JadwalFactory> */
    use HasFactory;

    protected $table = 'jadwal';

    protected $fillable = [
        'rute_id',
        'armada_id',
        'tanggal_berangkat',
        'jam_berangkat',
    ];

    protected $casts = [
        'tanggal_berangkat' => 'date',
        'jam_berangkat' => 'datetime:H:i:s',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relasi ke rute
     */
    public function rute(): BelongsTo
    {
        return $this->belongsTo(Rute::class);
    }

    /**
     * Relasi ke supir via armada
     */
    public function supir()
    {
        return $this->hasOneThrough(Supir::class, Armada::class, 'id', 'id', 'armada_id', 'supir_id');
    }

    /**
     * Relasi ke armada
     */
    public function armada(): BelongsTo
    {
        return $this->belongsTo(Armada::class);
    }

    /**
     * Relasi ke pemesanan
     */
    public function pemesanan(): HasMany
    {
        return $this->hasMany(Pemesanan::class);
    }
}
