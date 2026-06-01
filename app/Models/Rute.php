<?php

namespace App\Models;

use Database\Factories\RuteFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rute extends Model
{
    /** @use HasFactory<RuteFactory> */
    use HasFactory;

    protected $table = 'rute';

    protected $fillable = [
        'kota_asal',
        'kota_tujuan',
        'harga_tiket',
        'estimasi_waktu_jam',
    ];

    protected $casts = [
        'harga_tiket' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relasi ke jadwal
     */
    public function jadwal(): HasMany
    {
        return $this->hasMany(Jadwal::class);
    }

    /**
     * Relasi ke armada
     */
    public function armada(): HasMany
    {
        return $this->hasMany(Armada::class);
    }
}
