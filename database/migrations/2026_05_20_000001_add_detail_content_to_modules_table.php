<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('modules', function (Blueprint $table): void {
            $table->string('purpose')->nullable()->after('description');
            $table->string('layer')->nullable()->after('purpose');
            $table->string('key_output')->nullable()->after('layer');
            $table->string('trading_pace')->nullable()->after('key_output');
            $table->string('short_name')->nullable()->after('trading_pace');
            $table->string('price')->nullable()->after('short_name');
            $table->text('module_overview')->nullable()->after('price');
            $table->json('core_features')->nullable()->after('module_overview');
            $table->json('customization_options')->nullable()->after('core_features');
            $table->json('best_used_for')->nullable()->after('customization_options');
            $table->text('summary')->nullable()->after('best_used_for');
        });
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table): void {
            $table->dropColumn([
                'purpose',
                'layer',
                'key_output',
                'trading_pace',
                'short_name',
                'price',
                'module_overview',
                'core_features',
                'customization_options',
                'best_used_for',
                'summary',
            ]);
        });
    }
};
