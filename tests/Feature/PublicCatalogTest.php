<?php

namespace Tests\Feature;

use App\Models\Module;
use App\Models\Playbook;
use App\Models\PlaybookCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicCatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_and_catalog_pages_render_public_records(): void
    {
        $category = PlaybookCategory::create([
            'name' => 'Market Data',
            'slug' => 'market-data',
            'sort_order' => 10,
            'is_active' => true,
        ]);

        Module::create([
            'playbook_category_id' => $category->id,
            'title' => 'Momentum Cycles',
            'slug' => 'momentum-cycles',
            'access' => 'core',
            'sort_order' => 10,
            'is_featured' => true,
            'is_active' => true,
            'published_at' => now(),
        ]);

        Module::create([
            'playbook_category_id' => $category->id,
            'title' => 'Draft Module',
            'slug' => 'draft-module',
            'access' => 'core',
            'sort_order' => 20,
            'is_featured' => false,
            'is_active' => true,
            'published_at' => null,
        ]);

        Playbook::create([
            'playbook_category_id' => $category->id,
            'framework' => 'Market Environment',
            'slug' => 'market-environment',
            'access' => 'base_access',
            'currency' => 'USD',
            'sort_order' => 10,
            'is_featured' => true,
            'is_active' => true,
            'published_at' => now(),
        ]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Home')
                ->where('modules.0.title', 'Momentum Cycles')
                ->where('playbooks.0.framework', 'Market Environment'));

        $this->get('/modules')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Modules/Index')
                ->has('modules', 1)
                ->where('modules.0.slug', 'momentum-cycles'));

        $this->get('/playbooks')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Playbooks/Index')
                ->has('playbooks', 1)
                ->where('playbooks.0.slug', 'market-environment'));
    }

    public function test_public_detail_pages_respect_publish_state(): void
    {
        $category = PlaybookCategory::create([
            'name' => 'Playbooks',
            'slug' => 'playbooks',
            'sort_order' => 10,
            'is_active' => true,
        ]);

        Module::create([
            'playbook_category_id' => $category->id,
            'title' => 'Momentum Cycles',
            'slug' => 'momentum-cycles',
            'access' => 'core',
            'sort_order' => 10,
            'is_featured' => true,
            'is_active' => true,
            'published_at' => now(),
        ]);

        Module::create([
            'playbook_category_id' => $category->id,
            'title' => 'Private Module',
            'slug' => 'private-module',
            'access' => 'core',
            'sort_order' => 20,
            'is_featured' => false,
            'is_active' => false,
            'published_at' => now(),
        ]);

        Playbook::create([
            'playbook_category_id' => $category->id,
            'framework' => 'Market Environment',
            'slug' => 'market-environment',
            'access' => 'base_access',
            'currency' => 'USD',
            'sort_order' => 10,
            'is_featured' => true,
            'is_active' => true,
            'published_at' => now(),
        ]);

        $this->get('/modules/momentum-cycles')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Modules/Show')
                ->where('module.slug', 'momentum-cycles'));

        $this->get('/playbooks/market-environment')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Playbooks/Show')
                ->where('playbook.slug', 'market-environment'));

        $this->get('/modules/private-module')->assertNotFound();
    }
}
