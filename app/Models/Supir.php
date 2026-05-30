<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supir extends Model
{
    /** @use HasFactory<\Database\Factories\SupirFactory> */
    use HasFactory;

    protected $table = 'supir';

    protected $fillable = [
        'nama_supir',
        'no_telp_supir',
        'status',
    ];

    protected $casts = [
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
