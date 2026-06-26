import { HudButton, HudPanel } from '@/Components/UI/Hud';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type {
    Column,
    FilterFn,
    PaginationState,
    SortingState,
    VisibilityState,
} from '@tanstack/react-table';
import {
    Check,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Columns3,
    Copy,
    RefreshCcw,
    Search,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

type MetadataColumn = {
    key: string;
    label: string;
};

type ProductPrice = {
    id?: string | null;
    active?: boolean | null;
    amount?: string | null;
    interval?: string | null;
    currency?: string | null;
    nickname?: string | null;
    lookup_key?: string | null;
    type?: string | null;
};

type LocalCatalogItem = {
    type: string;
    label: string;
    id?: string | null;
    slug?: string | null;
    url?: string | null;
    stripe_product_id?: string | null;
    stripe_price_id?: string | null;
};

type StripeProductRow = {
    id: string;
    product_id?: string | null;
    name: string;
    description?: string | null;
    active?: boolean | null;
    url?: string | null;
    type?: string | null;
    default_price_id?: string | null;
    default_price_amount?: string | null;
    price_count: number;
    prices: ProductPrice[];
    price_ids: string[];
    price_amounts: string[];
    price_intervals: string[];
    currency_codes: string[];
    local_catalog: LocalCatalogItem[];
    local_catalog_labels: string[];
    local_catalog_types: string[];
    livemode?: boolean | null;
    created_at?: string | null;
    updated_at?: string | null;
    metadata: Record<string, string>;
};

type ProductsIndexProps = {
    products: StripeProductRow[];
    metadataColumns: MetadataColumn[];
    fetchedAt: string | null;
    stripeError?: string | null;
};

type StatusFilter = 'all' | 'active' | 'inactive';

const columnHelper = createColumnHelper<StripeProductRow>();
const maxColumnWidth = 320;
const defaultColumnSize = 180;

const productGlobalFilter: FilterFn<StripeProductRow> = (
    row,
    _columnId,
    value,
) => {
    const search = String(value ?? '')
        .trim()
        .toLowerCase();

    if (!search) {
        return true;
    }

    return searchableText(row.original).includes(search);
};

export default function ProductsIndex({
    products,
    metadataColumns,
    fetchedAt,
    stripeError,
}: ProductsIndexProps) {
    const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 25,
    });
    const [copiedCell, setCopiedCell] = useState<string | null>(null);

    const handleCopyValue = useCallback((copyKey: string, value?: string | null) => {
        if (!value) {
            return;
        }

        void copyTextToClipboard(value).then(() => {
            setCopiedCell(copyKey);
            window.setTimeout(() => {
                setCopiedCell((current) =>
                    current === copyKey ? null : current,
                );
            }, 1200);
        }).catch(() => undefined);
    }, []);

    const data = useMemo(() => {
        if (selectedStatus === 'active') {
            return products.filter((product) => product.active === true);
        }

        if (selectedStatus === 'inactive') {
            return products.filter((product) => product.active === false);
        }

        return products;
    }, [products, selectedStatus]);

    const columns = useMemo(() => {
        const metadataColumnDefinition = (metadataColumn: MetadataColumn) =>
            columnHelper.accessor(
                (row) => row.metadata[metadataColumn.key] ?? '',
                {
                    id: `metadata.${metadataColumn.key}`,
                    header: metadataColumn.label,
                    size: 220,
                    cell: (info) => <CellValue value={info.getValue()} />,
                },
            );

        return [
            columnHelper.accessor('product_id', {
                header: 'Product ID',
                size: 230,
                cell: ({ row, getValue }) => (
                    <CopyableCell
                        value={getValue()}
                        label="Product ID"
                        copied={copiedCell === `${row.id}:product_id`}
                        onCopy={(value) =>
                            handleCopyValue(`${row.id}:product_id`, value)
                        }
                    />
                ),
            }),
            columnHelper.accessor('name', {
                header: 'Product',
                size: 280,
                cell: ({ row }) => (
                    <div className="min-w-0 max-w-full">
                        <p className="font-heading truncate text-xs tracking-[0.12em] text-white uppercase">
                            {row.original.name}
                        </p>
                        <p className="mt-1 truncate font-mono-display text-xs text-white/45">
                            {row.original.product_id || '--'}
                        </p>
                    </div>
                ),
            }),
            columnHelper.accessor('active', {
                header: 'Status',
                size: 130,
                cell: (info) => <StatusPill value={info.getValue()} />,
            }),
            columnHelper.accessor('default_price_amount', {
                header: 'Default Price',
                size: 220,
                cell: ({ row, getValue }) => (
                    <div className="min-w-0 max-w-full">
                        <CellValue value={getValue()} />
                        <code
                            className="mt-1 block truncate font-mono-display text-xs text-white/45"
                            title={row.original.default_price_id || undefined}
                        >
                            {row.original.default_price_id || '--'}
                        </code>
                    </div>
                ),
            }),
            columnHelper.accessor('price_count', {
                header: 'Prices',
                size: 260,
                cell: ({ row, getValue }) => (
                    <div className="min-w-0 max-w-full">
                        <p className="font-heading text-[0.62rem] tracking-[0.12em] text-white/65 uppercase">
                            {getValue()} {getValue() === 1 ? 'price' : 'prices'}
                        </p>
                        <PriceList prices={row.original.prices} />
                    </div>
                ),
            }),
            columnHelper.accessor((row) => row.local_catalog_labels.join(', '), {
                id: 'local_catalog',
                header: 'Local Catalog',
                size: 280,
                cell: ({ row }) => (
                    <LocalCatalogList items={row.original.local_catalog} />
                ),
            }),
            columnHelper.accessor('description', {
                header: 'Description',
                size: maxColumnWidth,
                cell: (info) => <CellValue value={info.getValue()} />,
            }),
            columnHelper.accessor('url', {
                header: 'URL',
                size: 260,
                cell: ({ row, getValue }) => (
                    <CopyableCell
                        value={getValue()}
                        label="URL"
                        copied={copiedCell === `${row.id}:url`}
                        onCopy={(value) =>
                            handleCopyValue(`${row.id}:url`, value)
                        }
                    />
                ),
            }),
            columnHelper.accessor('default_price_id', {
                header: 'Default Price ID',
                size: 230,
                cell: ({ row, getValue }) => (
                    <CopyableCell
                        value={getValue()}
                        label="Default price ID"
                        copied={copiedCell === `${row.id}:default_price_id`}
                        onCopy={(value) =>
                            handleCopyValue(
                                `${row.id}:default_price_id`,
                                value,
                            )
                        }
                    />
                ),
            }),
            columnHelper.accessor((row) => row.price_ids.join(', '), {
                id: 'price_ids',
                header: 'Price IDs',
                size: 260,
                cell: ({ row }) => <CodeList values={row.original.price_ids} />,
            }),
            columnHelper.accessor('livemode', {
                header: 'Mode',
                size: 120,
                cell: (info) => <ModePill value={info.getValue()} />,
            }),
            columnHelper.accessor('created_at', {
                header: 'Created',
                size: 160,
                cell: (info) => <CellValue value={formatDate(info.getValue())} />,
            }),
            columnHelper.accessor('updated_at', {
                header: 'Updated',
                size: 160,
                cell: (info) => <CellValue value={formatDate(info.getValue())} />,
            }),
            columnHelper.accessor('type', {
                header: 'Type',
                size: 120,
                cell: (info) => <CellValue value={info.getValue()} />,
            }),
            columnHelper.accessor((row) => row.currency_codes.join(', '), {
                id: 'currency_codes',
                header: 'Currency',
                size: 140,
                cell: ({ row }) => (
                    <CellList values={row.original.currency_codes} />
                ),
            }),
            columnHelper.accessor((row) => row.price_intervals.join(', '), {
                id: 'price_intervals',
                header: 'Intervals',
                size: 150,
                cell: ({ row }) => (
                    <CellList values={row.original.price_intervals} />
                ),
            }),
            ...metadataColumns.map((metadataColumn) =>
                metadataColumnDefinition(metadataColumn),
            ),
        ];
    }, [copiedCell, handleCopyValue, metadataColumns]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        globalFilterFn: productGlobalFilter,
        getRowId: (row) => row.id,
        defaultColumn: {
            size: defaultColumnSize,
            minSize: 96,
            maxSize: maxColumnWidth,
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    useEffect(() => {
        setPagination((current) => ({ ...current, pageIndex: 0 }));
    }, [selectedStatus, globalFilter]);

    const filteredCount = table.getFilteredRowModel().rows.length;
    const statusOptions: Array<{ label: string; value: StatusFilter }> = [
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
    ];

    return (
        <AdminLayout>
            <Head title="Stripe Products" />

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="font-heading text-seafoam-green text-xs tracking-[0.22em] uppercase">
                        Stripe Sync
                    </p>
                    <h2 className="font-heading mt-1 text-2xl tracking-[0.12em] text-white uppercase">
                        Products
                    </h2>
                    <p className="mt-2 text-sm text-white/55">
                        {fetchedAt
                            ? `Fetched ${formatDateTime(fetchedAt)}`
                            : 'Live Stripe directory'}
                    </p>
                </div>
                <HudButton
                    href={route('admin.products.index')}
                    tone="blue"
                    className="gap-2"
                >
                    <RefreshCcw className="h-4 w-4" aria-hidden />
                    Refresh
                </HudButton>
            </div>

            {stripeError ? (
                <HudPanel className="border-violet-light/45 bg-violet-light/10 mb-5 p-5">
                    <p className="font-heading text-violet-light text-sm tracking-[0.16em] uppercase">
                        Stripe Unavailable
                    </p>
                    <p className="mt-2 text-sm text-white/65">{stripeError}</p>
                </HudPanel>
            ) : null}

            <HudPanel className="overflow-hidden">
                <div className="border-main-blue/25 border-b p-5">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h3 className="font-heading text-sm tracking-[0.16em] text-white uppercase">
                                Product Directory
                            </h3>
                            <p className="mt-1 text-xs text-white/50">
                                {filteredCount} of {products.length} Stripe
                                products
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <label className="relative block min-w-72">
                                <span className="sr-only">Search products</span>
                                <Search
                                    className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/35"
                                    aria-hidden
                                />
                                <input
                                    className="border-main-blue/40 bg-panel-deep focus:border-seafoam-green/70 focus:ring-seafoam-green/20 w-full rounded-sm border py-3 pr-4 pl-10 text-sm text-white outline-none transition placeholder:text-white/35 focus:ring-2"
                                    value={globalFilter}
                                    onChange={(event) =>
                                        setGlobalFilter(event.target.value)
                                    }
                                    placeholder="Search Stripe products"
                                />
                            </label>

                            <ColumnVisibilityMenu tableColumns={table.getAllLeafColumns()} />
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_16rem]">
                        <div className="flex flex-wrap gap-2">
                            {statusOptions.map((status) => (
                                <StatusFilterButton
                                    key={status.value}
                                    active={selectedStatus === status.value}
                                    label={status.label}
                                    onClick={() => setSelectedStatus(status.value)}
                                />
                            ))}
                        </div>

                        <label>
                            <span className="sr-only">Filter by status</span>
                            <select
                                className="border-main-blue/40 bg-panel-deep focus:border-seafoam-green/70 focus:ring-seafoam-green/20 w-full rounded-sm border px-4 py-3 font-heading text-xs tracking-[0.12em] text-white uppercase outline-none transition focus:ring-2"
                                value={selectedStatus}
                                onChange={(event) =>
                                    setSelectedStatus(
                                        event.target.value as StatusFilter,
                                    )
                                }
                            >
                                {statusOptions.map((status) => (
                                    <option
                                        key={status.value}
                                        value={status.value}
                                    >
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table
                        className="w-max table-fixed text-left text-sm"
                        style={{ width: table.getTotalSize() }}
                    >
                        <thead className="font-heading text-seafoam-green text-xs tracking-[0.14em] uppercase">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className="border-main-blue/20 border-b px-5 py-4 align-bottom whitespace-nowrap"
                                            style={columnSizeStyle(
                                                header.column,
                                            )}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <button
                                                    type="button"
                                                    className="hover:text-white disabled:cursor-default disabled:hover:text-seafoam-green flex w-full min-w-0 items-center gap-2 transition"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    disabled={
                                                        !header.column.getCanSort()
                                                    }
                                                >
                                                    <span className="min-w-0 truncate">
                                                        {flexRender(
                                                            header.column.columnDef
                                                                .header,
                                                            header.getContext(),
                                                        )}
                                                    </span>
                                                    <span className="shrink-0 text-white/45">
                                                        {{
                                                            asc: 'Asc',
                                                            desc: 'Desc',
                                                        }[
                                                            header.column.getIsSorted() as string
                                                        ] ?? ''}
                                                    </span>
                                                </button>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-main-blue/20 hover:bg-main-blue/10 border-t transition"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-5 py-4 align-middle text-white/70"
                                            style={columnSizeStyle(cell.column)}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {!table.getRowModel().rows.length ? (
                                <tr>
                                    <td
                                        className="px-5 py-10 text-center text-sm text-white/50"
                                        colSpan={
                                            table.getVisibleLeafColumns().length
                                        }
                                    >
                                        No Stripe products match this view.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>

                <div className="border-main-blue/25 flex flex-wrap items-center justify-between gap-3 border-t p-5">
                    <p className="text-sm text-white/50">
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {Math.max(table.getPageCount(), 1)}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            className="border-main-blue/40 bg-panel-deep rounded-sm border px-3 py-2 font-heading text-xs tracking-[0.12em] text-white uppercase outline-none focus:border-seafoam-green"
                            value={table.getState().pagination.pageSize}
                            onChange={(event) =>
                                table.setPageSize(Number(event.target.value))
                            }
                        >
                            {[10, 25, 50, 100].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize} rows
                                </option>
                            ))}
                        </select>

                        <PaginationButton
                            label="First page"
                            disabled={!table.getCanPreviousPage()}
                            onClick={() => table.firstPage()}
                        >
                            <ChevronsLeft className="h-4 w-4" aria-hidden />
                        </PaginationButton>
                        <PaginationButton
                            label="Previous page"
                            disabled={!table.getCanPreviousPage()}
                            onClick={() => table.previousPage()}
                        >
                            <ChevronLeft className="h-4 w-4" aria-hidden />
                        </PaginationButton>
                        <PaginationButton
                            label="Next page"
                            disabled={!table.getCanNextPage()}
                            onClick={() => table.nextPage()}
                        >
                            <ChevronRight className="h-4 w-4" aria-hidden />
                        </PaginationButton>
                        <PaginationButton
                            label="Last page"
                            disabled={!table.getCanNextPage()}
                            onClick={() => table.lastPage()}
                        >
                            <ChevronsRight className="h-4 w-4" aria-hidden />
                        </PaginationButton>
                    </div>
                </div>
            </HudPanel>
        </AdminLayout>
    );
}

function StatusFilterButton({
    active,
    label,
    onClick,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            className={[
                'font-heading inline-flex min-h-10 items-center rounded-sm border px-3 py-2 text-[0.65rem] tracking-[0.12em] uppercase transition',
                active
                    ? 'border-seafoam-green/60 bg-seafoam-green/10 text-seafoam-green shadow-[0_0_18px_rgba(0,250,146,0.16)]'
                    : 'border-main-blue/40 bg-main-blue/10 text-white/60 hover:border-seafoam-green/45 hover:text-seafoam-green',
            ].join(' ')}
            onClick={onClick}
        >
            {label}
        </button>
    );
}

function ColumnVisibilityMenu({
    tableColumns,
}: {
    tableColumns: Column<StripeProductRow, unknown>[];
}) {
    return (
        <details className="relative">
            <summary className="border-main-blue/45 bg-main-blue/10 text-sky-300 hover:border-seafoam-green/60 hover:bg-seafoam-green/10 hover:text-seafoam-green inline-flex min-h-11 cursor-pointer list-none items-center justify-center gap-2 rounded-sm border px-4 py-3 font-heading text-xs font-semibold tracking-[0.14em] uppercase transition [&::-webkit-details-marker]:hidden">
                <Columns3 className="h-4 w-4" aria-hidden />
                Columns
            </summary>
            <div className="border-main-blue/45 bg-panel-deep absolute right-0 z-20 mt-2 max-h-80 w-80 overflow-auto rounded-md border p-3 shadow-[0_0_28px_rgba(55,100,245,0.2)]">
                <div className="grid gap-2">
                    {tableColumns
                        .filter((column) => column.getCanHide())
                        .map((column) => (
                            <label
                                key={column.id}
                                className="flex items-center gap-3 rounded-sm px-2 py-2 text-sm text-white/70 hover:bg-main-blue/10"
                            >
                                <input
                                    type="checkbox"
                                    className="accent-seafoam-green"
                                    checked={column.getIsVisible()}
                                    onChange={column.getToggleVisibilityHandler()}
                                />
                                <span>{columnLabel(column)}</span>
                            </label>
                        ))}
                </div>
            </div>
        </details>
    );
}

function PaginationButton({
    label,
    disabled,
    onClick,
    children,
}: {
    label: string;
    disabled: boolean;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            className="border-main-blue/45 bg-main-blue/10 text-sky-300 hover:border-seafoam-green/60 hover:text-seafoam-green disabled:cursor-not-allowed disabled:opacity-40 inline-flex size-10 items-center justify-center rounded-sm border transition"
            aria-label={label}
            title={label}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

function StatusPill({ value }: { value?: boolean | null }) {
    if (value === null || value === undefined) {
        return <CellValue value={null} />;
    }

    return (
        <span
            className={[
                'font-heading inline-flex rounded-sm border px-2 py-1 text-[0.62rem] tracking-[0.12em] uppercase',
                value
                    ? 'border-seafoam-green/50 bg-seafoam-green/10 text-seafoam-green'
                    : 'border-gold/50 bg-gold/10 text-gold',
            ].join(' ')}
        >
            {value ? 'Active' : 'Inactive'}
        </span>
    );
}

function ModePill({ value }: { value?: boolean | null }) {
    if (value === null || value === undefined) {
        return <CellValue value={null} />;
    }

    return (
        <span className="font-heading border-violet-light/45 bg-violet-light/10 text-violet-light inline-flex rounded-sm border px-2 py-1 text-[0.62rem] tracking-[0.12em] uppercase">
            {value ? 'Live' : 'Test'}
        </span>
    );
}

function CopyableCell({
    value,
    label,
    copied,
    onCopy,
}: {
    value?: string | null;
    label: string;
    copied: boolean;
    onCopy: (value: string) => void;
}) {
    const hasValue = Boolean(value);

    return (
        <span className="flex min-w-0 max-w-full items-center gap-2">
            <span className="block min-w-0 flex-1 truncate" title={value || undefined}>
                {value || '--'}
            </span>
            <button
                type="button"
                className="border-main-blue/40 bg-main-blue/10 text-sky-300 hover:border-seafoam-green/60 hover:text-seafoam-green disabled:cursor-not-allowed disabled:opacity-30 inline-flex size-7 shrink-0 items-center justify-center rounded-sm border transition"
                aria-label={`Copy ${label}`}
                title={hasValue ? `Copy ${label}` : `${label} unavailable`}
                disabled={!hasValue}
                onClick={() => {
                    if (value) {
                        onCopy(value);
                    }
                }}
            >
                {copied ? (
                    <Check className="h-3.5 w-3.5" aria-hidden />
                ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden />
                )}
            </button>
        </span>
    );
}

function PriceList({ prices }: { prices: ProductPrice[] }) {
    if (!prices.length) {
        return <CellValue value={null} />;
    }

    return (
        <div className="mt-2 flex min-w-0 max-w-full flex-wrap gap-2">
            {prices.slice(0, 3).map((price, index) => (
                <span
                    key={price.id || index}
                    className="border-main-blue/45 bg-main-blue/10 inline-flex max-w-full rounded-sm border px-2 py-1 text-[0.68rem] text-white/70"
                    title={[price.id, price.amount, price.nickname]
                        .filter(Boolean)
                        .join(' | ')}
                >
                    <span className="truncate">
                        {price.amount || price.id || '--'}
                    </span>
                </span>
            ))}
            {prices.length > 3 ? (
                <span className="text-xs text-white/40">
                    +{prices.length - 3} more
                </span>
            ) : null}
        </div>
    );
}

function LocalCatalogList({ items }: { items: LocalCatalogItem[] }) {
    if (!items.length) {
        return <CellValue value={null} />;
    }

    return (
        <div className="flex min-w-0 max-w-full flex-wrap gap-2">
            {items.map((item) => {
                const label = `${item.type}: ${item.label}`;

                return item.url ? (
                    <a
                        key={`${item.type}:${item.id}:${item.label}`}
                        className="font-heading border-seafoam-green/45 bg-seafoam-green/10 text-seafoam-green inline-flex max-w-full rounded-sm border px-2 py-1 text-[0.62rem] tracking-[0.12em] uppercase hover:border-white/45 hover:text-white"
                        href={item.url}
                        title={label}
                    >
                        <span className="truncate">{label}</span>
                    </a>
                ) : (
                    <span
                        key={`${item.type}:${item.id}:${item.label}`}
                        className="font-heading border-main-blue/45 bg-main-blue/10 inline-flex max-w-full rounded-sm border px-2 py-1 text-[0.62rem] tracking-[0.12em] text-sky-300 uppercase"
                        title={label}
                    >
                        <span className="truncate">{label}</span>
                    </span>
                );
            })}
        </div>
    );
}

function CellValue({ value }: { value?: string | null }) {
    return (
        <span className="block max-w-full truncate" title={value || undefined}>
            {value || '--'}
        </span>
    );
}

function CodeValue({ value }: { value?: string | null }) {
    return (
        <code
            className="block max-w-full truncate font-mono-display text-xs text-white/60"
            title={value || undefined}
        >
            {value || '--'}
        </code>
    );
}

function CellList({ values }: { values: string[] }) {
    return <CellValue value={formatList(values)} />;
}

function CodeList({ values }: { values: string[] }) {
    return <CodeValue value={formatList(values)} />;
}

function formatList(values: string[]) {
    return values.length ? values.join(', ') : null;
}

function formatDate(value?: string | null) {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
}

function formatDateTime(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(date);
}

function searchableText(row: StripeProductRow) {
    return [
        row.product_id,
        row.name,
        row.description,
        row.url,
        row.type,
        row.default_price_id,
        row.default_price_amount,
        row.price_ids.join(' '),
        row.price_amounts.join(' '),
        row.price_intervals.join(' '),
        row.currency_codes.join(' '),
        row.local_catalog_labels.join(' '),
        row.local_catalog_types.join(' '),
        row.created_at,
        row.updated_at,
        Object.values(row.metadata).join(' '),
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
}

function columnLabel(column: Column<StripeProductRow, unknown>) {
    return typeof column.columnDef.header === 'string'
        ? column.columnDef.header
        : column.id;
}

function columnSizeStyle(
    column: Column<StripeProductRow, unknown>,
): CSSProperties {
    const width = Math.min(column.getSize(), maxColumnWidth);

    return {
        boxSizing: 'border-box',
        maxWidth: maxColumnWidth,
        width,
    };
}

async function copyTextToClipboard(value: string) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);

        return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    textarea.style.position = 'fixed';

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
