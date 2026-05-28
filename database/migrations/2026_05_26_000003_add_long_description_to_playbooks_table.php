<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('playbooks', function (Blueprint $table): void {
            $table->text('long_description')->nullable()->after('best_for');
        });
    }

    public function down(): void
    {
        Schema::table('playbooks', function (Blueprint $table): void {
            $table->dropColumn('long_description');
        });
    }
};
