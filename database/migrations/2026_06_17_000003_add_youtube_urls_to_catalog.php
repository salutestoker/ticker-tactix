<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('modules', function (Blueprint $table): void {
            $table->string('youtube_url', 2048)->nullable()->after('action_url');
        });

        Schema::table('playbooks', function (Blueprint $table): void {
            $table->string('youtube_url', 2048)->nullable()->after('action_url');
        });
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table): void {
            $table->dropColumn('youtube_url');
        });

        Schema::table('playbooks', function (Blueprint $table): void {
            $table->dropColumn('youtube_url');
        });
    }
};
