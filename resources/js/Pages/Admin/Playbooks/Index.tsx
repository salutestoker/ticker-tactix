import { IconRenderer } from '@/Components/Icons/IconRenderer';
import {
    HudButton,
    HudPanel,
    StatusBadge,
    TaxonomyBadge,
} from '@/Components/UI/Hud';
import AdminLayout from '@/Layouts/AdminLayout';
import type { Playbook } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function AdminPlaybooksIndex({
    playbooks,
}: {
    playbooks: Playbook[];
}) {
    const [rows, setRows] = useState(playbooks);
    const [draggedId, setDraggedId] = useState<number | null>(null);
    const [isReordering, setIsReordering] = useState(false);

    useEffect(() => {
        setRows(playbooks);
    }, [playbooks]);

    function reorderRows(sourceId: number, targetId: number) {
        if (sourceId === targetId) {
            return;
        }

        const sourceIndex = rows.findIndex((row) => row.id === sourceId);
        const targetIndex = rows.findIndex((row) => row.id === targetId);

        if (sourceIndex < 0 || targetIndex < 0) {
            return;
        }

        const nextRows = [...rows];
        const [movedRow] = nextRows.splice(sourceIndex, 1);
        nextRows.splice(targetIndex, 0, movedRow);

        setRows(nextRows);
        setIsReordering(true);

        router.post(
            route('admin.playbooks.reorder'),
            {
                ordered_ids: nextRows.map((row) => row.id),
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setDraggedId(null);
                    setIsReordering(false);
                },
                onError: () => {
                    setRows(playbooks);
                },
            },
        );
    }

    return (
        <AdminLayout>
            <Head title="Manage Playbooks" />
            <HudPanel className="overflow-hidden">
                <div className="border-main-blue/25 flex items-center justify-between border-b p-5">
                    <div>
                        <h2 className="font-heading text-sm tracking-[0.16em] text-white uppercase">
                            Playbooks
                        </h2>
                        <p className="mt-1 text-xs tracking-normal text-white/55 normal-case">
                            Drag rows to change display order.
                        </p>
                    </div>
                    <HudButton href={route('admin.playbooks.create')}>
                        Create Playbook
                    </HudButton>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="font-heading text-seafoam-green text-xs tracking-[0.14em] uppercase">
                            <tr>
                                <th className="w-14 px-5 py-4">Move</th>
                                <th className="px-5 py-4">Title</th>
                                <th className="px-5 py-4">Trader Types</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((playbook) => (
                                <tr
                                    key={playbook.id}
                                    className={[
                                        'border-main-blue/20 border-t',
                                        draggedId === playbook.id
                                            ? 'bg-main-blue/10 opacity-70'
                                            : '',
                                        isReordering ? 'cursor-progress' : '',
                                    ].join(' ')}
                                    onDragOver={(event) =>
                                        event.preventDefault()
                                    }
                                    onDrop={() =>
                                        draggedId !== null &&
                                        reorderRows(draggedId, playbook.id)
                                    }
                                >
                                    <td className="px-5 py-4 align-middle">
                                        <button
                                            type="button"
                                            className="text-white/50 hover:text-seafoam-green cursor-grab active:cursor-grabbing"
                                            draggable
                                            aria-label={`Drag ${playbook.title} to reorder`}
                                            onDragStart={(event) => {
                                                event.dataTransfer.effectAllowed =
                                                    'move';
                                                setDraggedId(playbook.id);
                                            }}
                                            onDragEnd={() => setDraggedId(null)}
                                        >
                                            <IconRenderer
                                                name="drag-handle"
                                                className="h-5 w-5"
                                            />
                                        </button>
                                    </td>
                                    <td className="px-5 py-4 text-white">
                                        {playbook.title}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {(
                                                playbook.trader_types ??
                                                playbook.traderTypes ??
                                                []
                                            ).map((type) => (
                                                <TaxonomyBadge
                                                    key={type.id}
                                                    label={type.name}
                                                    color={type.color}
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <StatusBadge
                                            active={playbook.is_active}
                                            published={playbook.published_at}
                                        />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-2">
                                            <HudButton
                                                href={route(
                                                    'admin.playbooks.edit',
                                                    playbook.id,
                                                )}
                                                tone="blue"
                                            >
                                                Edit
                                            </HudButton>
                                            <HudButton
                                                type="button"
                                                tone="violet"
                                                onClick={() =>
                                                    router.delete(
                                                        route(
                                                            'admin.playbooks.destroy',
                                                            playbook.id,
                                                        ),
                                                    )
                                                }
                                            >
                                                Archive
                                            </HudButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </HudPanel>
        </AdminLayout>
    );
}
