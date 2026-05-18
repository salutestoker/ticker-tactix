<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('trader_types')) {
            Schema::create('trader_types', function (Blueprint $table): void {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->string('color')->nullable();
                $table->string('icon')->nullable();
                $table->unsignedInteger('sort_order')->default(0);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
                $table->softDeletes();
            });
        }

        if (! Schema::hasTable('markets')) {
            Schema::create('markets', function (Blueprint $table): void {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->string('color')->nullable();
                $table->unsignedInteger('sort_order')->default(0);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
                $table->softDeletes();
            });
        }

        Schema::table('modules', function (Blueprint $table): void {
            if (! Schema::hasColumn('modules', 'market_id')) {
                $table->foreignId('market_id')->nullable()->after('id')->constrained()->nullOnDelete();
            }

            if (! Schema::hasColumn('modules', 'action_label')) {
                $table->string('action_label')->nullable()->after('access');
            }
        });

        Schema::table('playbooks', function (Blueprint $table): void {
            if (! Schema::hasColumn('playbooks', 'market_id')) {
                $table->foreignId('market_id')->nullable()->after('id')->constrained()->nullOnDelete();
            }

            if (! Schema::hasColumn('playbooks', 'icon')) {
                $table->string('icon')->nullable()->after('market_id');
            }

            if (! Schema::hasColumn('playbooks', 'title')) {
                $table->string('title')->nullable()->after('icon');
            }

            if (! Schema::hasColumn('playbooks', 'trading_pace')) {
                $table->string('trading_pace')->nullable()->after('best_for');
            }

            if (! Schema::hasColumn('playbooks', 'price')) {
                $table->string('price')->nullable()->after('average_hold_time');
            }

            if (! Schema::hasColumn('playbooks', 'action_label')) {
                $table->string('action_label')->nullable()->after('price');
            }
        });

        if (! Schema::hasTable('module_trader_type')) {
            Schema::create('module_trader_type', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('module_id')->constrained()->cascadeOnDelete();
                $table->foreignId('trader_type_id')->constrained()->cascadeOnDelete();
                $table->timestamps();
                $table->unique(['module_id', 'trader_type_id']);
            });
        }

        if (! Schema::hasTable('module_related_modules')) {
            Schema::create('module_related_modules', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('module_id')->constrained('modules')->cascadeOnDelete();
                $table->foreignId('related_module_id')->constrained('modules')->cascadeOnDelete();
                $table->timestamps();
                $table->unique(['module_id', 'related_module_id']);
            });
        }

        if (! Schema::hasTable('playbook_trader_type')) {
            Schema::create('playbook_trader_type', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('playbook_id')->constrained()->cascadeOnDelete();
                $table->foreignId('trader_type_id')->constrained()->cascadeOnDelete();
                $table->timestamps();
                $table->unique(['playbook_id', 'trader_type_id']);
            });
        }

        Schema::table('modules', function (Blueprint $table): void {
            if (Schema::hasColumn('modules', 'playbook_category_id')) {
                $table->dropConstrainedForeignId('playbook_category_id');
            }

            foreach (['purpose', 'what_it_does', 'key_output', 'payment_url'] as $column) {
                if (Schema::hasColumn('modules', $column)) {
                    $table->dropColumn($column);
                }
            }
        });

        Schema::table('playbooks', function (Blueprint $table): void {
            if (Schema::hasColumn('playbooks', 'playbook_category_id')) {
                $table->dropConstrainedForeignId('playbook_category_id');
            }

            foreach (['framework', 'market', 'price_cents', 'currency', 'payment_url'] as $column) {
                if (Schema::hasColumn('playbooks', $column)) {
                    $table->dropColumn($column);
                }
            }
        });

        Schema::dropIfExists('playbook_categories');
    }

    public function down(): void
    {
        //
    }
};
