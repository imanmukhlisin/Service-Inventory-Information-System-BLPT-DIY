<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SparePartStock extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'stok_sekarang' => 'integer',
        'stok_minimum' => 'integer',
        'terakhir_diperbarui' => 'datetime',
    ];

    public function sparePart(): BelongsTo
    {
        return $this->belongsTo(SparePart::class);
    }
}
