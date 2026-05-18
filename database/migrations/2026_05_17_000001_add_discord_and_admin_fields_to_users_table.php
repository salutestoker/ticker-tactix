<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('discord_id')->nullable()->unique()->after('id');
            $table->string('discord_username')->nullable()->after('discord_id');
            $table->string('discord_global_name')->nullable()->after('discord_username');
            $table->string('discord_avatar')->nullable()->after('discord_global_name');
            $table->json('discord_role_ids')->nullable()->after('discord_avatar');
            $table->timestamp('discord_roles_synced_at')->nullable()->after('discord_role_ids');
            $table->boolean('is_admin')->default(false)->after('password');
            $table->string('email')->nullable()->change();
            $table->string('password')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropUnique(['discord_id']);
            $table->dropColumn([
                'discord_id',
                'discord_username',
                'discord_global_name',
                'discord_avatar',
                'discord_role_ids',
                'discord_roles_synced_at',
                'is_admin',
            ]);
        });
    }
};
