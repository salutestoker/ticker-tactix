<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('modules', function (Blueprint $table): void {
            $table->string('banner_image', 2048)->nullable()->after('image_path');
        });

        Schema::table('playbooks', function (Blueprint $table): void {
            $table->string('banner_image', 2048)->nullable()->after('logo_path');
        });
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table): void {
            $table->dropColumn('banner_image');
        });

        Schema::table('playbooks', function (Blueprint $table): void {
            $table->dropColumn('banner_image');
        });
    }
};
