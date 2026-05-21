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
        if (! Schema::hasColumn('modules', 'action_url')) {
            Schema::table('modules', function (Blueprint $table): void {
                $table->string('action_url', 2048)->nullable()->after('access');
            });
        }

        if (Schema::hasColumn('modules', 'action_label')) {
            Schema::table('modules', function (Blueprint $table): void {
                $table->dropColumn('action_label');
            });
        }

        if (! Schema::hasColumn('playbooks', 'action_url')) {
            Schema::table('playbooks', function (Blueprint $table): void {
                $table->string('action_url', 2048)->nullable()->after('price');
            });
        }

        if (Schema::hasColumn('playbooks', 'action_label')) {
            Schema::table('playbooks', function (Blueprint $table): void {
                $table->dropColumn('action_label');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('modules', 'action_label')) {
            Schema::table('modules', function (Blueprint $table): void {
                $table->string('action_label')->nullable()->after('access');
            });
        }

        if (Schema::hasColumn('modules', 'action_url')) {
            Schema::table('modules', function (Blueprint $table): void {
                $table->dropColumn('action_url');
            });
        }

        if (! Schema::hasColumn('playbooks', 'action_label')) {
            Schema::table('playbooks', function (Blueprint $table): void {
                $table->string('action_label')->nullable()->after('price');
            });
        }

        if (Schema::hasColumn('playbooks', 'action_url')) {
            Schema::table('playbooks', function (Blueprint $table): void {
                $table->dropColumn('action_url');
            });
        }
    }
};
