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
        Schema::table('jadwal', function (Blueprint $table) {
            $table->dropForeign(['rute_id']);
            $table->dropForeign(['supir_id']);
            $table->dropColumn(['rute_id', 'supir_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jadwal', function (Blueprint $table) {
            $table->foreignId('rute_id')->nullable()->constrained('rute')->cascadeOnDelete();
            $table->foreignId('supir_id')->nullable()->constrained('supir')->cascadeOnDelete();
        });
    }
};
