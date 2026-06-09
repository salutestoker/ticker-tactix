<?php

namespace Tests\Feature;

use App\Models\NewsletterGeneration;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminNewsletterGeneratorTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_save_newsletter_generation_values(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $values = $this->newsletterValues(['date' => '2026-06-09']);

        $this->actingAs($admin)
            ->post(route('admin.newsletter-generator.store'), [
                'values' => $values,
            ])
            ->assertRedirect(route('admin.newsletter-generator'));

        $generation = NewsletterGeneration::firstOrFail();

        $this->assertSame($admin->id, $generation->user_id);
        $this->assertSame(NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT, $generation->template);
        $this->assertEquals($values, $generation->values);
    }

    public function test_generator_uses_latest_saved_generation_as_default(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        NewsletterGeneration::create([
            'template' => NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT,
            'values' => $this->newsletterValues(['date' => '2026-06-08']),
        ]);

        NewsletterGeneration::create([
            'template' => NewsletterGeneration::TEMPLATE_NYSE_MARKET_ENVIRONMENT,
            'values' => $this->newsletterValues([
                'date' => '2026-06-09',
                'marketCommentary' => 'Most recent generated commentary.',
            ]),
        ]);

        $this->actingAs($admin)
            ->get(route('admin.newsletter-generator'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Newsletters/Generator')
                ->where('defaultValues.date', '2026-06-09')
                ->where('defaultValues.marketCommentary', 'Most recent generated commentary.'));
    }

    private function newsletterValues(array $overrides = []): array
    {
        return array_replace_recursive([
            'date' => '2026-06-09',
            'cards' => [
                'spyi' => [
                    'price' => '$53.16',
                    's2' => '58.48',
                    's1' => '55.82',
                    'b1' => '50.50',
                    'b2' => '47.84',
                ],
                'qqqi' => [
                    'price' => '$56.05',
                    's2' => '61.66',
                    's1' => '58.85',
                    'b1' => '53.25',
                    'b2' => '50.45',
                ],
                'iwmi' => [
                    'price' => '$50.77',
                    's2' => '55.85',
                    's1' => '53.31',
                    'b1' => '48.23',
                    'b2' => '45.69',
                ],
                'tltw' => [
                    'price' => '$21.82',
                    's2' => '24.00',
                    's1' => '22.91',
                    'b1' => '20.73',
                    'b2' => '19.64',
                ],
            ],
            'probabilities' => [
                'es1' => '75% BEARISH',
                'nq1' => '80% BEARISH',
                'spx' => '90% BEARISH',
                'qqq' => '85% BEARISH',
                'fatmaan' => '80% BEARISH',
                'svix' => '80% BULLISH',
                'dxy' => '80% BEARISH',
            ],
            'marketCommentary' => 'Generated market commentary.',
        ], $overrides);
    }
}
