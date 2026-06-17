<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('modules', function (Blueprint $table): void {
            $table->string('stripe_product_id')->nullable()->after('action_url');
            $table->string('stripe_price_id')->nullable()->after('stripe_product_id');
            $table->string('purchase_email_subject')->nullable()->after('stripe_price_id');
            $table->text('purchase_email_body')->nullable()->after('purchase_email_subject');

            $table->index('stripe_product_id', 'modules_stripe_product_id_index');
            $table->index('stripe_price_id', 'modules_stripe_price_id_index');
        });

        Schema::table('playbooks', function (Blueprint $table): void {
            $table->string('stripe_product_id')->nullable()->after('action_url');
            $table->string('stripe_price_id')->nullable()->after('stripe_product_id');
            $table->string('purchase_email_subject')->nullable()->after('stripe_price_id');
            $table->text('purchase_email_body')->nullable()->after('purchase_email_subject');

            $table->index('stripe_product_id', 'playbooks_stripe_product_id_index');
            $table->index('stripe_price_id', 'playbooks_stripe_price_id_index');
        });
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table): void {
            $table->dropIndex('modules_stripe_product_id_index');
            $table->dropIndex('modules_stripe_price_id_index');
            $table->dropColumn([
                'stripe_product_id',
                'stripe_price_id',
                'purchase_email_subject',
                'purchase_email_body',
            ]);
        });

        Schema::table('playbooks', function (Blueprint $table): void {
            $table->dropIndex('playbooks_stripe_product_id_index');
            $table->dropIndex('playbooks_stripe_price_id_index');
            $table->dropColumn([
                'stripe_product_id',
                'stripe_price_id',
                'purchase_email_subject',
                'purchase_email_body',
            ]);
        });
    }
};
