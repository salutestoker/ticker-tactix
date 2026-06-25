import { IconRenderer } from '@/Components/Icons/IconRenderer';
import { HudButton, HudPanel } from '@/Components/UI/Hud';
import AdminLayout from '@/Layouts/AdminLayout';
import type { Faq } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
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
import type { FormEvent, ReactNode } from 'react';

type FaqFormData = {
    question: string;
    answer: string;
};

export default function AdminFaqsIndex({ faqs }: { faqs: Faq[] }) {
    const [rows, setRows] = useState(faqs);
    const [activeId, setActiveId] = useState<number | null>(null);
    const { data, setData, post, processing, errors, reset } =
        useForm<FaqFormData>({
            question: '',
            answer: '',
        });
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
        setRows(faqs);
    }, [faqs]);

    function submit(event: FormEvent) {
        event.preventDefault();

        post(route('admin.faqs.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

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
            route('admin.faqs.reorder'),
            {
                ordered_ids: nextRows.map((row) => row.id),
            },
            {
                preserveScroll: true,
                onFinish: () => setActiveId(null),
                onError: () => setRows(faqs),
            },
        );
    }

    return (
        <AdminLayout publicViewHref={route('faq')}>
            <Head title="Manage FAQs" />
            <div className="grid gap-6">
                <HudPanel className="p-6">
                    <div className="mb-5">
                        <h2 className="font-heading text-sm tracking-[0.16em] text-white uppercase">
                            Create FAQ
                        </h2>
                        <p className="mt-1 text-xs text-white/55">
                            Add a question and plain-text answer.
                        </p>
                    </div>
                    <form className="grid gap-5" onSubmit={submit}>
                        <Field label="Question" error={errors.question}>
                            <input
                                className={inputClass}
                                value={data.question}
                                onChange={(event) =>
                                    setData('question', event.target.value)
                                }
                            />
                        </Field>
                        <Field label="Answer" error={errors.answer}>
                            <textarea
                                className={`${inputClass} min-h-32 resize-y`}
                                value={data.answer}
                                onChange={(event) =>
                                    setData('answer', event.target.value)
                                }
                            />
                        </Field>
                        <div>
                            <HudButton type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create FAQ'}
                            </HudButton>
                        </div>
                    </form>
                </HudPanel>

                <HudPanel className="overflow-hidden">
                    <div className="border-main-blue/25 border-b p-5">
                        <h2 className="font-heading text-sm tracking-[0.16em] text-white uppercase">
                            FAQs
                        </h2>
                        <p className="mt-1 text-xs tracking-normal text-white/55 normal-case">
                            Drag rows to change display order.
                        </p>
                    </div>
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
                            <div className="grid gap-0">
                                {rows.map((faq) => (
                                    <FaqRow
                                        key={faq.id}
                                        faq={faq}
                                        active={activeId === faq.id}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                    {rows.length === 0 ? (
                        <p className="border-main-blue/20 border-t p-6 text-sm text-white/60">
                            No FAQs have been added yet.
                        </p>
                    ) : null}
                </HudPanel>
            </div>
        </AdminLayout>
    );
}

function FaqRow({ faq, active }: { faq: Faq; active: boolean }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({
            id: faq.id,
        });
    const { data, setData, patch, processing, errors } = useForm<FaqFormData>({
        question: faq.question,
        answer: faq.answer,
    });

    useEffect(() => {
        setData({
            question: faq.question,
            answer: faq.answer,
        });
    }, [faq.answer, faq.question]);

    function submit(event: FormEvent) {
        event.preventDefault();

        patch(route('admin.faqs.update', faq.id), {
            preserveScroll: true,
        });
    }

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className={[
                'border-main-blue/20 border-t p-5',
                active || isDragging ? 'bg-main-blue/10 opacity-80' : '',
            ].join(' ')}
        >
            <form className="grid gap-4 lg:grid-cols-[auto_1fr_auto]" onSubmit={submit}>
                <button
                    type="button"
                    className="text-white/50 hover:text-seafoam-green active:cursor-grabbing h-11 cursor-grab rounded-sm p-2 transition"
                    aria-label={`Drag ${faq.question} to reorder`}
                    title="Drag to reorder"
                    {...attributes}
                    {...listeners}
                >
                    <IconRenderer name="drag-handle" className="h-5 w-5" />
                </button>
                <div className="grid gap-4">
                    <Field label="Question" error={errors.question}>
                        <input
                            className={inputClass}
                            value={data.question}
                            onChange={(event) =>
                                setData('question', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Answer" error={errors.answer}>
                        <textarea
                            className={`${inputClass} min-h-28 resize-y`}
                            value={data.answer}
                            onChange={(event) =>
                                setData('answer', event.target.value)
                            }
                        />
                    </Field>
                </div>
                <div className="flex flex-wrap items-start gap-2">
                    <HudButton type="submit" tone="blue" disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </HudButton>
                    <HudButton
                        type="button"
                        tone="violet"
                        onClick={() =>
                            router.delete(route('admin.faqs.destroy', faq.id), {
                                preserveScroll: true,
                            })
                        }
                    >
                        Delete
                    </HudButton>
                </div>
            </form>
        </div>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <label className="font-mono-display block text-xs tracking-[0.16em] text-white/80 uppercase">
            {label}
            {children}
            {error ? (
                <span className="font-body text-violet-light mt-2 block text-sm tracking-normal normal-case">
                    {error}
                </span>
            ) : null}
        </label>
    );
}

const inputClass =
    'mt-2 w-full rounded-sm border border-main-blue/35 bg-panel-deep px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-seafoam-green focus:ring-2 focus:ring-seafoam-green/25';
