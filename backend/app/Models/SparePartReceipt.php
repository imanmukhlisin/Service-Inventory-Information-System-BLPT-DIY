<?php

namespace App\Models;

use App\Enums\ReceiptStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SparePartReceipt extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'jumlah_diterima' => 'integer',
        'status_verifikasi' => ReceiptStatus::class,
        'tanggal_verifikasi' => 'datetime',
    ];

    public function sparePartOrder(): BelongsTo
    {
        return $this->belongsTo(SparePartOrder::class);
    }
}
