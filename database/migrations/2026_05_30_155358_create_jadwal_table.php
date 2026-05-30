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
        Schema::create('jadwal', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rute_id')->constrained('rute')->onDelete('cascade');
            $table->foreignId('supir_id')->constrained('supir')->onDelete('cascade');
            $table->foreignId('armada_id')->constrained('armada')->onDelete('cascade');
            $table->date('tanggal_berangkat');
            $table->time('jam_berangkat');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal');
    }
};
