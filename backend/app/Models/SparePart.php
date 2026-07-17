<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SparePart extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'harga_jual' => 'decimal:2',
    ];

    public function stock(): HasOne
    {
        return $this->hasOne(SparePartStock::class);
    }

    public function transactionSpareParts(): HasMany
    {
        return $this->hasMany(TransactionSparePart::class);
    }

    public function sparePartOrders(): HasMany
    {
        return $this->hasMany(SparePartOrder::class);
    }
}
