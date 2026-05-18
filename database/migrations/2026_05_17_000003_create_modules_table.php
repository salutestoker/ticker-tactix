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
            $table->foreignId('playbook_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('icon')->nullable();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('purpose')->nullable();
            $table->text('description')->nullable();
            $table->text('what_it_does')->nullable();
            $table->string('key_output')->nullable();
            $table->string('version')->nullable();
            $table->string('access')->default('core');
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
        Schema::dropIfExists('modules');
    }
};
