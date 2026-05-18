<?php

namespace App\Http\Controllers;

use App\Models\Playbook;
use Inertia\Inertia;
use Inertia\Response;

class PlaybookController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Playbooks/Index', [
            'playbooks' => Playbook::public()->with('category')->ordered()->get(),
        ]);
    }

    public function show(Playbook $playbook): Response
    {
        abort_unless($playbook->is_active && $playbook->published_at, 404);

        return Inertia::render('Playbooks/Show', [
            'playbook' => $playbook->load('category'),
            'relatedPlaybooks' => Playbook::public()
                ->with('category')
                ->whereKeyNot($playbook->id)
                ->where('playbook_category_id', $playbook->playbook_category_id)
                ->ordered()
                ->take(4)
                ->get(),
        ]);
    }
}
