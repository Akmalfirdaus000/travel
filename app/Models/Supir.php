<?php

namespace App\Models;

use Database\Factories\SupirFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Supir extends Model
{
    /** @use HasFactory<SupirFactory> */
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

    /**
     * Relasi ke armada
     */
    public function armada(): HasOne
    {
        return $this->hasOne(Armada::class);
    }
}
