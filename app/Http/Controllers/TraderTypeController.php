<?php

namespace App\Http\Controllers;

use App\Models\TraderType;
use Inertia\Inertia;
use Inertia\Response;

class TraderTypeController extends Controller
{
    public function show(TraderType $traderType): Response
    {
        abort_unless($traderType->is_active, 404);

        return Inertia::render('TraderTypes/Show', [
            'traderType' => $traderType->load([
                'modules' => fn ($query) => $query
                    ->public()
                    ->with(['market', 'traderTypes'])
                    ->ordered(),
                'playbooks' => fn ($query) => $query
                    ->public()
                    ->with(['market', 'traderTypes'])
                    ->ordered(),
            ]),
        ]);
    }
}
