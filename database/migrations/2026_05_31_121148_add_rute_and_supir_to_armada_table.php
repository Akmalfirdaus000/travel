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
        Schema::table('armada', function (Blueprint $table) {
            $table->foreignId('rute_id')->nullable()->after('id')->constrained('rute')->nullOnDelete();
            $table->foreignId('supir_id')->nullable()->after('rute_id')->constrained('supir')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('armada', function (Blueprint $table) {
            $table->dropForeign(['rute_id']);
            $table->dropForeign(['supir_id']);
            $table->dropColumn(['rute_id', 'supir_id']);
        });
    }
};
