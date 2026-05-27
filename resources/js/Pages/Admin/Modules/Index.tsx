import { IconRenderer } from '@/Components/Icons/IconRenderer';
import { HudButton, HudPanel, StatusBadge } from '@/Components/UI/Hud';
import { RotatingTaxonomyBadges } from '@/Components/UI/RotatingTaxonomyBadges';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatVersion } from '@/lib/format';
import type { Module } from '@/types';
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

export default function AdminModulesIndex({ modules }: { modules: Module[] }) {
    const [rows, setRows] = useState(modules);
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
        setRows(modules);
    }, [modules]);

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
            route('admin.modules.reorder'),
            {
                ordered_ids: nextRows.map((row) => row.id),
            },
            {
                preserveScroll: true,
                onFinish: () => setActiveId(null),
                onError: () => {
                    setRows(modules);
                },
            },
        );
    }

    return (
        <AdminLayout>
            <Head title="Manage Modules" />
            <HudPanel className="overflow-hidden">
                <div className="border-main-blue/25 flex items-center justify-between border-b p-5">
                    <div>
                        <h2 className="font-heading text-sm tracking-[0.16em] text-white uppercase">
                            Modules
                        </h2>
                        <p className="mt-1 text-xs tracking-normal text-white/55 normal-case">
                            Drag rows to change display order.
                        </p>
                    </div>
                    <HudButton href={route('admin.modules.create')}>
                        Create Module
                    </HudButton>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="font-heading text-seafoam-green text-xs tracking-[0.14em] uppercase">
                            <tr>
                                <th className="w-14 px-5 py-4">Move</th>
                                <th className="px-5 py-4">Title</th>
                                <th className="px-5 py-4">Trader Types</th>
                                <th className="px-5 py-4">Version</th>
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
                                    {rows.map((module) => (
                                        <ModuleRow
                                            key={module.id}
                                            module={module}
                                            active={activeId === module.id}
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

function ModuleRow({
    module,
    active,
}: {
    module: Module;
    active: boolean;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({
            id: module.id,
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
                    aria-label={`Drag ${module.title} to reorder`}
                    title="Drag to reorder"
                    {...attributes}
                    {...listeners}
                >
                    <IconRenderer name="drag-handle" className="h-5 w-5" />
                </button>
            </td>
            <td className="px-5 py-4 text-white">{module.title}</td>
            <td className="px-5 py-4 align-middle">
                <RotatingTaxonomyBadges
                    types={module.trader_types ?? module.traderTypes ?? []}
                />
            </td>
            <td className="text-violet-light px-5 py-4">
                {formatVersion(module.version)}
            </td>
            <td className="px-5 py-4">
                <StatusBadge
                    active={module.is_active}
                    published={module.published_at}
                />
            </td>
            <td className="px-5 py-4">
                <div className="flex gap-2">
                    <HudButton
                        href={route('admin.modules.edit', module.id)}
                        tone="blue"
                    >
                        Edit
                    </HudButton>
                    <HudButton
                        type="button"
                        tone="violet"
                        onClick={() =>
                            router.delete(route('admin.modules.destroy', module.id))
                        }
                    >
                        Archive
                    </HudButton>
                </div>
            </td>
        </tr>
    );
}
