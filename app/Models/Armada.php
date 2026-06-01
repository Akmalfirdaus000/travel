<?php

namespace App\Models;

use Database\Factories\ArmadaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Armada extends Model
{
    /** @use HasFactory<ArmadaFactory> */
    use HasFactory;

    protected $table = 'armada';

    protected $fillable = [
        'supir_id',
        'plat_nomor',
        'tipe_mobil',
        'kapasitas_kursi',
    ];

    protected $casts = [
        'kapasitas_kursi' => 'integer',
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
     * Relasi ke supir
     */
    public function supir(): BelongsTo
    {
        return $this->belongsTo(Supir::class);
    }
}
