<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('newsletter_generations', function (Blueprint $table): void {
            $table->id();
            $table->string('template')->index();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->json('values');
            $table->timestamps();

            $table->index(['template', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('newsletter_generations');
    }
};
