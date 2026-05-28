<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('modules', function (Blueprint $table): void {
            $table->string('image_path', 2048)->nullable()->after('icon');
        });
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table): void {
            $table->dropColumn('image_path');
        });
    }
};
