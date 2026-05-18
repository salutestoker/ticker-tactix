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
            $table->foreignId('playbook_category_id')->constrained()->cascadeOnDelete();
            $table->string('framework');
            $table->string('slug')->unique();
            $table->string('access');
            $table->string('market')->nullable();
            $table->text('best_for')->nullable();
            $table->string('average_hold_time')->nullable();
            $table->unsignedInteger('price_cents')->nullable();
            $table->string('currency', 3)->default('USD');
            $table->string('payment_url')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('playbooks');
    }
};
