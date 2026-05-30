<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rute extends Model
{
    /** @use HasFactory<\Database\Factories\RuteFactory> */
    use HasFactory;

    protected $table = 'rute';

    protected $fillable = [
        'kota_asal',
        'kota_tujuan',
        'harga_tiket',
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
}
