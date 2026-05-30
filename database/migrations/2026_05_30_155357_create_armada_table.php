<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('armada', function (Blueprint $table) {
            $table->id();
            $table->string('plat_nomor', 15)->unique();
            $table->string('tipe_mobil', 50);
            $table->integer('kapasitas_kursi');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('armada');
    }
};
