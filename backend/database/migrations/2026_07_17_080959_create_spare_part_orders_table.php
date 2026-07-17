<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('spare_part_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('spare_part_id')->constrained('spare_parts')->restrictOnDelete();
            $table->unsignedInteger('jumlah');
            $table->string('status');
            $table->text('catatan')->nullable();
            $table->timestamp('tanggal_keputusan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('spare_part_orders');
    }
};
