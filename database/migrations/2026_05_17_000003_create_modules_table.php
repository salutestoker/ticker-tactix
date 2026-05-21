<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('modules', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('market_id')->constrained()->restrictOnDelete();
            $table->string('icon')->nullable();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('version', 6, 3)->nullable();
            $table->string('access');
            $table->string('action_url', 2048)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('module_trader_type', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('module_id')->constrained()->cascadeOnDelete();
            $table->foreignId('trader_type_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['module_id', 'trader_type_id']);
        });

        Schema::create('module_related_modules', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('module_id')->constrained('modules')->cascadeOnDelete();
            $table->foreignId('related_module_id')->constrained('modules')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['module_id', 'related_module_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('module_related_modules');
        Schema::dropIfExists('module_trader_type');
        Schema::dropIfExists('modules');
    }
};
