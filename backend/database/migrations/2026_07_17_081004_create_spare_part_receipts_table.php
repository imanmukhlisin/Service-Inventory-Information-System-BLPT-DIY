<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('spare_part_receipts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('spare_part_order_id')->constrained('spare_part_orders')->cascadeOnDelete();
            $table->unsignedInteger('jumlah_diterima');
            $table->string('status_verifikasi');
            $table->text('catatan')->nullable();
            $table->timestamp('tanggal_verifikasi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('spare_part_receipts');
    }
};
