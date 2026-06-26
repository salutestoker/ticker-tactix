<?php

namespace App\Http\Controllers;

use App\Models\Playbook;
use App\Support\CatalogRichText;
use Inertia\Inertia;
use Inertia\Response;

class PlaybookController extends Controller
{
    public function index(): Response
    {
        $playbooks = Playbook::public()->with(['market', 'traderTypes'])->ordered()->get();
        CatalogRichText::renderPlaybooks($playbooks);

        return Inertia::render('Playbooks/Index', [
            'playbooks' => $playbooks,
        ]);
    }

    public function show(Playbook $playbook): Response
    {
        abort_unless($playbook->is_active && $playbook->published_at, 404);

        $playbook->load(['market', 'traderTypes']);
        CatalogRichText::renderPlaybook($playbook);

        return Inertia::render('Playbooks/Show', [
            'playbook' => $playbook,
        ]);
    }
}
