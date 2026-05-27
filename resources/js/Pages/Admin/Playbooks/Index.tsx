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
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';

export default function AdminPlaybooksIndex({
    playbooks,
}: {
    playbooks: Playbook[];
}) {
    const [rows, setRows] = useState(playbooks);
    const [activeId, setActiveId] = useState<number | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    useEffect(() => {
        setRows(playbooks);
    }, [playbooks]);

    function handleDragStart(event: DragStartEvent) {
        setActiveId(Number(event.active.id));
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        setActiveId(null);

        if (!over || active.id === over.id) {
            return;
        }

        const sourceIndex = rows.findIndex((row) => row.id === active.id);
        const targetIndex = rows.findIndex((row) => row.id === over.id);

        if (sourceIndex < 0 || targetIndex < 0) {
            return;
        }

        const nextRows = arrayMove(rows, sourceIndex, targetIndex);
        setRows(nextRows);

        router.post(
            route('admin.playbooks.reorder'),
            {
                ordered_ids: nextRows.map((row) => row.id),
            },
            {
                preserveScroll: true,
                onFinish: () => setActiveId(null),
                onError: () => setRows(playbooks),
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
                        <DndContext
                            collisionDetection={closestCenter}
                            sensors={sensors}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onDragCancel={() => setActiveId(null)}
                        >
                            <SortableContext
                                items={rows.map((row) => row.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <tbody>
                                    {rows.map((playbook) => (
                                        <PlaybookRow
                                            key={playbook.id}
                                            playbook={playbook}
                                            active={activeId === playbook.id}
                                        />
                                    ))}
                                </tbody>
                            </SortableContext>
                        </DndContext>
                    </table>
                </div>
            </HudPanel>
        </AdminLayout>
    );
}

function PlaybookRow({
    playbook,
    active,
}: {
    playbook: Playbook;
    active: boolean;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({
            id: playbook.id,
        });

    return (
        <tr
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className={[
                'border-main-blue/20 border-t',
                active || isDragging ? 'bg-main-blue/10 opacity-80' : '',
            ].join(' ')}
        >
            <td className="px-5 py-4 align-middle">
                <button
                    type="button"
                    className="text-white/50 hover:text-seafoam-green active:cursor-grabbing cursor-grab rounded-sm p-1 transition"
                    aria-label={`Drag ${playbook.title} to reorder`}
                    title="Drag to reorder"
                    {...attributes}
                    {...listeners}
                >
                    <IconRenderer name="drag-handle" className="h-5 w-5" />
                </button>
            </td>
            <td className="px-5 py-4 text-white">{playbook.title}</td>
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
                        href={route('admin.playbooks.edit', playbook.id)}
                        tone="blue"
                    >
                        Edit
                    </HudButton>
                    <HudButton
                        type="button"
                        tone="violet"
                        onClick={() =>
                            router.delete(route('admin.playbooks.destroy', playbook.id))
                        }
                    >
                        Archive
                    </HudButton>
                </div>
            </td>
        </tr>
    );
}
