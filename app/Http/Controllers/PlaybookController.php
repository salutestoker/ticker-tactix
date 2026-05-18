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
            'playbooks' => Playbook::public()->with(['market', 'traderTypes'])->ordered()->get(),
        ]);
    }

    public function show(Playbook $playbook): Response
    {
        abort_unless($playbook->is_active && $playbook->published_at, 404);

        return Inertia::render('Playbooks/Show', [
            'playbook' => $playbook->load(['market', 'traderTypes']),
        ]);
    }
}
