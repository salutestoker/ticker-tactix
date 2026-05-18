<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('playbooks', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('market_id')->constrained()->restrictOnDelete();
            $table->string('icon')->nullable();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('access');
            $table->text('best_for')->nullable();
            $table->string('trading_pace')->nullable();
            $table->string('average_hold_time')->nullable();
            $table->string('price')->nullable();
            $table->string('action_label')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('playbook_trader_type', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('playbook_id')->constrained()->cascadeOnDelete();
            $table->foreignId('trader_type_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['playbook_id', 'trader_type_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('playbook_trader_type');
        Schema::dropIfExists('playbooks');
    }
};
