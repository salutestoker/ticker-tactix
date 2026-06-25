<?php

namespace Tests\Feature;

use App\Models\Faq;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FaqTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_faq_page_renders_ordered_faqs_without_deleted_records(): void
    {
        Faq::create([
            'question' => 'Second Question',
            'answer' => 'Second answer.',
            'sort_order' => 20,
        ]);
        Faq::create([
            'question' => 'First Question',
            'answer' => "First answer.\nWith a second line.",
            'sort_order' => 10,
        ]);
        Faq::create([
            'question' => 'Deleted Question',
            'answer' => 'Deleted answer.',
            'sort_order' => 5,
        ])->delete();

        $this->get('/faq')
            ->assertOk()
            ->assertHeader('X-Robots-Tag', 'noindex, nofollow, noarchive')
            ->assertSee('<meta name="robots" content="noindex, nofollow, noarchive">', false)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Faq')
                ->has('faqs', 2)
                ->where('faqs.0.question', 'First Question')
                ->where('faqs.0.answer', "First answer.\nWith a second line.")
                ->where('faqs.1.question', 'Second Question'));
    }

    public function test_admin_faq_pages_require_admin_access(): void
    {
        $this->get(route('admin.faqs.index'))->assertRedirect('/login');

        $user = User::factory()->create(['is_admin' => false]);
        $faq = Faq::create([
            'question' => 'Protected Question',
            'answer' => 'Protected answer.',
            'sort_order' => 10,
        ]);

        $this->actingAs($user)
            ->get(route('admin.faqs.index'))
            ->assertForbidden();

        $this->actingAs($user)
            ->post(route('admin.faqs.store'), [
                'question' => 'Guest Question',
                'answer' => 'Guest answer.',
            ])
            ->assertForbidden();

        $this->actingAs($user)
            ->patch(route('admin.faqs.update', $faq), [
                'question' => 'Updated Question',
                'answer' => 'Updated answer.',
            ])
            ->assertForbidden();

        $this->actingAs($user)
            ->post(route('admin.faqs.reorder'), [
                'ordered_ids' => [$faq->id],
            ])
            ->assertForbidden();

        $this->actingAs($user)
            ->delete(route('admin.faqs.destroy', $faq))
            ->assertForbidden();
    }

    public function test_admin_can_create_update_reorder_and_delete_faqs(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->post(route('admin.faqs.store'), [
                'question' => 'How do I get access?',
                'answer' => 'Complete checkout and connect Discord.',
            ])
            ->assertRedirect(route('admin.faqs.index'));

        $faq = Faq::where('question', 'How do I get access?')->firstOrFail();

        $this->assertDatabaseHas(Faq::class, [
            'id' => $faq->id,
            'answer' => 'Complete checkout and connect Discord.',
            'sort_order' => 1,
        ]);

        $this->actingAs($admin)
            ->patch(route('admin.faqs.update', $faq), [
                'question' => 'How do I update access?',
                'answer' => "Open support.\nInclude your checkout email.",
            ])
            ->assertRedirect();

        $this->assertDatabaseHas(Faq::class, [
            'id' => $faq->id,
            'question' => 'How do I update access?',
            'answer' => "Open support.\nInclude your checkout email.",
        ]);

        $secondFaq = Faq::create([
            'question' => 'What is Ticker Tactix?',
            'answer' => 'A rules-based market operating system.',
            'sort_order' => 20,
        ]);

        $this->actingAs($admin)
            ->post(route('admin.faqs.reorder'), [
                'ordered_ids' => [$secondFaq->id, $faq->id],
            ])
            ->assertRedirect();

        $this->assertDatabaseHas(Faq::class, [
            'id' => $secondFaq->id,
            'sort_order' => 0,
        ]);
        $this->assertDatabaseHas(Faq::class, [
            'id' => $faq->id,
            'sort_order' => 1,
        ]);

        $this->actingAs($admin)
            ->delete(route('admin.faqs.destroy', $faq))
            ->assertRedirect();

        $this->assertSoftDeleted(Faq::class, [
            'id' => $faq->id,
        ]);
    }

    public function test_admin_faq_validation_requires_question_and_answer(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $faq = Faq::create([
            'question' => 'Existing Question',
            'answer' => 'Existing answer.',
            'sort_order' => 10,
        ]);

        $this->actingAs($admin)
            ->from(route('admin.faqs.index'))
            ->post(route('admin.faqs.store'), [
                'question' => '',
                'answer' => '',
            ])
            ->assertRedirect(route('admin.faqs.index'))
            ->assertSessionHasErrors(['question', 'answer']);

        $this->actingAs($admin)
            ->from(route('admin.faqs.index'))
            ->patch(route('admin.faqs.update', $faq), [
                'question' => '',
                'answer' => '',
            ])
            ->assertRedirect(route('admin.faqs.index'))
            ->assertSessionHasErrors(['question', 'answer']);
    }
}
