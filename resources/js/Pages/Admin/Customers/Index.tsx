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
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Check,
    Columns3,
    Copy,
    RefreshCcw,
    Search,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

type ProductOption = {
    label: string;
    value: string;
    productIds: string[];
};

type MetadataColumn = {
    key: string;
    label: string;
};

type SubscriberProduct = {
    name: string;
    id?: string | null;
};

type StripeSubscriberRow = {
    id: string;
    customer_id?: string | null;
    customer_name?: string | null;
    customer_email?: string | null;
    customer_phone?: string | null;
    subscription_id?: string | null;
    subscription_status?: string | null;
    product_names: string[];
    product_ids: string[];
    products: SubscriberProduct[];
    price_ids: string[];
    amounts: string[];
    intervals: string[];
    quantity_total: number;
    currency_codes: string[];
    current_period_start?: string | null;
    current_period_end?: string | null;
    cancel_at?: string | null;
    canceled_at?: string | null;
    ended_at?: string | null;
    trial_start?: string | null;
    trial_end?: string | null;
    created_at?: string | null;
    cancel_at_period_end?: boolean | null;
    livemode?: boolean | null;
    metadata: Record<string, string>;
};

type CustomersIndexProps = {
    subscribers: StripeSubscriberRow[];
    productOptions: ProductOption[];
    metadataColumns: MetadataColumn[];
    fetchedAt: string | null;
    stripeError?: string | null;
};

const columnHelper = createColumnHelper<StripeSubscriberRow>();
const allProductsValue = '__all_products__';
const maxColumnWidth = 300;
const defaultColumnSize = 180;
const checkoutCustomFieldPrefix = 'checkout.custom_fields.';

const subscriberGlobalFilter: FilterFn<StripeSubscriberRow> = (
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

export default function CustomersIndex({
    subscribers,
    productOptions,
    metadataColumns,
    fetchedAt,
    stripeError,
}: CustomersIndexProps) {
    const [selectedProduct, setSelectedProduct] = useState(allProductsValue);
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
        if (selectedProduct === allProductsValue) {
            return subscribers;
        }

        return subscribers.filter((subscriber) =>
            subscriber.product_names.includes(selectedProduct),
        );
    }, [selectedProduct, subscribers]);

    const columns = useMemo(() => {
        const handleMetadataColumns = metadataColumns
            .filter(isCheckoutHandleMetadataColumn)
            .sort(
                (left, right) =>
                    checkoutHandleOrder(left) - checkoutHandleOrder(right),
            );
        const otherMetadataColumns = metadataColumns.filter(
            (metadataColumn) => !isCheckoutHandleMetadataColumn(metadataColumn),
        );
        const metadataColumnDefinition = (
            metadataColumn: MetadataColumn,
            copyable = false,
        ) =>
            columnHelper.accessor(
                (row) => row.metadata[metadataColumn.key] ?? '',
                {
                    id: `metadata.${metadataColumn.key}`,
                    header: metadataColumn.label,
                    size: copyable ? 190 : 220,
                    cell: ({ row, getValue }) =>
                        copyable ? (
                            <CopyableCell
                                value={getValue()}
                                label={metadataColumn.label}
                                copied={
                                    copiedCell ===
                                    `${row.id}:${metadataColumn.key}`
                                }
                                onCopy={(value) =>
                                    handleCopyValue(
                                        `${row.id}:${metadataColumn.key}`,
                                        value,
                                    )
                                }
                            />
                        ) : (
                            <CellValue value={getValue()} />
                        ),
                },
            );

        return [
            columnHelper.accessor('customer_name', {
                header: 'Customer',
                size: 260,
                cell: ({ row }) => (
                    <div className="min-w-0 max-w-full">
                        <p className="font-heading truncate text-xs tracking-[0.12em] text-white uppercase">
                            {row.original.customer_name || 'Unnamed customer'}
                        </p>
                        <p className="mt-1 truncate text-xs text-white/45">
                            {row.original.customer_id || '--'}
                        </p>
                    </div>
                ),
            }),
            columnHelper.accessor('customer_email', {
                header: 'Email',
                size: 260,
                cell: ({ row, getValue }) => (
                    <CopyableCell
                        value={getValue()}
                        label="Email"
                        copied={copiedCell === `${row.id}:customer_email`}
                        onCopy={(value) =>
                            handleCopyValue(
                                `${row.id}:customer_email`,
                                value,
                            )
                        }
                    />
                ),
            }),
            ...handleMetadataColumns.map((metadataColumn) =>
                metadataColumnDefinition(metadataColumn, true),
            ),
            columnHelper.accessor('customer_phone', {
                header: 'Phone',
                size: 160,
                cell: (info) => <CellValue value={info.getValue()} />,
            }),
            columnHelper.accessor('subscription_status', {
                header: 'Status',
                size: 140,
                cell: (info) => <StatusPill status={info.getValue()} />,
            }),
            columnHelper.accessor((row) => row.product_names.join(', '), {
                id: 'product_names',
                header: 'Products',
                size: maxColumnWidth,
                cell: ({ row }) => (
                    <div className="flex min-w-0 max-w-full flex-wrap gap-2">
                        {row.original.product_names.length ? (
                            row.original.product_names.map((product) => (
                                <span
                                    key={product}
                                    className="font-heading border-main-blue/45 bg-main-blue/10 inline-flex max-w-full rounded-sm border px-2 py-1 text-[0.62rem] tracking-[0.12em] text-sky-300 uppercase"
                                    title={product}
                                >
                                    <span className="truncate">{product}</span>
                                </span>
                            ))
                        ) : (
                            <span className="text-white/40">--</span>
                        )}
                    </div>
                ),
            }),
            columnHelper.accessor((row) => row.amounts.join(', '), {
                id: 'amounts',
                header: 'Amount',
                size: 220,
                cell: ({ row }) => <CellList values={row.original.amounts} />,
            }),
            columnHelper.accessor('quantity_total', {
                header: 'Qty',
                size: 100,
                cell: (info) => <CellValue value={String(info.getValue())} />,
            }),
            columnHelper.accessor('current_period_end', {
                header: 'Period Ends',
                size: 170,
                cell: (info) => <CellValue value={formatDate(info.getValue())} />,
            }),
            columnHelper.accessor('cancel_at_period_end', {
                header: 'Cancel End',
                size: 150,
                cell: (info) => <BooleanPill value={info.getValue()} />,
            }),
            columnHelper.accessor('trial_end', {
                header: 'Trial Ends',
                size: 160,
                cell: (info) => <CellValue value={formatDate(info.getValue())} />,
            }),
            columnHelper.accessor('subscription_id', {
                header: 'Subscription ID',
                size: 220,
                cell: (info) => <CodeValue value={info.getValue()} />,
            }),
            columnHelper.accessor('customer_id', {
                header: 'Customer ID',
                size: 220,
                cell: (info) => <CodeValue value={info.getValue()} />,
            }),
            columnHelper.accessor((row) => row.product_ids.join(', '), {
                id: 'product_ids',
                header: 'Product IDs',
                size: 220,
                cell: ({ row }) => <CodeList values={row.original.product_ids} />,
            }),
            columnHelper.accessor((row) => row.price_ids.join(', '), {
                id: 'price_ids',
                header: 'Price IDs',
                size: 220,
                cell: ({ row }) => <CodeList values={row.original.price_ids} />,
            }),
            columnHelper.accessor((row) => row.intervals.join(', '), {
                id: 'intervals',
                header: 'Intervals',
                size: 150,
                cell: ({ row }) => <CellList values={row.original.intervals} />,
            }),
            columnHelper.accessor((row) => row.currency_codes.join(', '), {
                id: 'currency_codes',
                header: 'Currency',
                size: 140,
                cell: ({ row }) => (
                    <CellList values={row.original.currency_codes} />
                ),
            }),
            columnHelper.accessor('livemode', {
                header: 'Mode',
                size: 120,
                cell: (info) => (
                    <span className="font-heading border-violet-light/45 bg-violet-light/10 text-violet-light inline-flex rounded-sm border px-2 py-1 text-[0.62rem] tracking-[0.12em] uppercase">
                        {info.getValue() ? 'Live' : 'Test'}
                    </span>
                ),
            }),
            columnHelper.accessor('created_at', {
                header: 'Created',
                size: 160,
                cell: (info) => <CellValue value={formatDate(info.getValue())} />,
            }),
            columnHelper.accessor('current_period_start', {
                header: 'Period Starts',
                size: 170,
                cell: (info) => <CellValue value={formatDate(info.getValue())} />,
            }),
            columnHelper.accessor('trial_start', {
                header: 'Trial Starts',
                size: 160,
                cell: (info) => <CellValue value={formatDate(info.getValue())} />,
            }),
            columnHelper.accessor('cancel_at', {
                header: 'Cancel At',
                size: 160,
                cell: (info) => <CellValue value={formatDate(info.getValue())} />,
            }),
            columnHelper.accessor('canceled_at', {
                header: 'Canceled At',
                size: 160,
                cell: (info) => <CellValue value={formatDate(info.getValue())} />,
            }),
            columnHelper.accessor('ended_at', {
                header: 'Ended At',
                size: 160,
                cell: (info) => <CellValue value={formatDate(info.getValue())} />,
            }),
            ...otherMetadataColumns.map((metadataColumn) =>
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
        globalFilterFn: subscriberGlobalFilter,
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
    }, [selectedProduct, globalFilter]);

    const filteredCount = table.getFilteredRowModel().rows.length;

    return (
        <AdminLayout>
            <Head title="Stripe Customers" />

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="font-heading text-seafoam-green text-xs tracking-[0.22em] uppercase">
                        Stripe Sync
                    </p>
                    <h2 className="font-heading mt-1 text-2xl tracking-[0.12em] text-white uppercase">
                        Customers
                    </h2>
                    <p className="mt-2 text-sm text-white/55">
                        {fetchedAt
                            ? `Fetched ${formatDateTime(fetchedAt)}`
                            : 'Live Stripe directory'}
                    </p>
                </div>
                <HudButton
                    href={route('admin.customers.index')}
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
                                Subscriber Directory
                            </h3>
                            <p className="mt-1 text-xs text-white/50">
                                {filteredCount} of {subscribers.length} Stripe
                                subscriptions
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <label className="relative block min-w-72">
                                <span className="sr-only">Search customers</span>
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
                                    placeholder="Search Stripe customers"
                                />
                            </label>

                            <ColumnVisibilityMenu tableColumns={table.getAllLeafColumns()} />
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
                        <div className="flex flex-wrap gap-2">
                            <ProductFilterButton
                                active={selectedProduct === allProductsValue}
                                label="All products"
                                onClick={() => setSelectedProduct(allProductsValue)}
                            />
                            {productOptions.map((product) => (
                                <ProductFilterButton
                                    key={product.value}
                                    active={selectedProduct === product.value}
                                    label={product.label}
                                    onClick={() =>
                                        setSelectedProduct(product.value)
                                    }
                                />
                            ))}
                        </div>

                        <label>
                            <span className="sr-only">Filter by product</span>
                            <select
                                className="border-main-blue/40 bg-panel-deep focus:border-seafoam-green/70 focus:ring-seafoam-green/20 w-full rounded-sm border px-4 py-3 font-heading text-xs tracking-[0.12em] text-white uppercase outline-none transition focus:ring-2"
                                value={selectedProduct}
                                onChange={(event) =>
                                    setSelectedProduct(event.target.value)
                                }
                            >
                                <option value={allProductsValue}>
                                    All products
                                </option>
                                {productOptions.map((product) => (
                                    <option
                                        key={product.value}
                                        value={product.value}
                                    >
                                        {product.label}
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
                                        No Stripe customers match this view.
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

function ProductFilterButton({
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
    tableColumns: Column<StripeSubscriberRow, unknown>[];
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

function StatusPill({ status }: { status?: string | null }) {
    const normalized = status ?? '--';
    const active = normalized === 'active' || normalized === 'trialing';

    return (
        <span
            className={[
                'font-heading inline-flex rounded-sm border px-2 py-1 text-[0.62rem] tracking-[0.12em] uppercase',
                active
                    ? 'border-seafoam-green/50 bg-seafoam-green/10 text-seafoam-green'
                    : 'border-gold/50 bg-gold/10 text-gold',
            ].join(' ')}
        >
            {normalized}
        </span>
    );
}

function BooleanPill({ value }: { value?: boolean | null }) {
    if (value === null || value === undefined) {
        return <CellValue value={null} />;
    }

    return (
        <span
            className={[
                'font-heading inline-flex rounded-sm border px-2 py-1 text-[0.62rem] tracking-[0.12em] uppercase',
                value
                    ? 'border-gold/50 bg-gold/10 text-gold'
                    : 'border-main-blue/45 bg-main-blue/10 text-sky-300',
            ].join(' ')}
        >
            {value ? 'Yes' : 'No'}
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
            className="font-mono-display block max-w-full truncate text-xs text-white/60"
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

function searchableText(row: StripeSubscriberRow) {
    return [
        row.customer_id,
        row.customer_name,
        row.customer_email,
        row.customer_phone,
        row.subscription_id,
        row.subscription_status,
        row.product_names.join(' '),
        row.product_ids.join(' '),
        row.price_ids.join(' '),
        row.amounts.join(' '),
        row.intervals.join(' '),
        row.currency_codes.join(' '),
        row.current_period_start,
        row.current_period_end,
        row.cancel_at,
        row.canceled_at,
        row.ended_at,
        row.trial_start,
        row.trial_end,
        row.created_at,
        Object.values(row.metadata).join(' '),
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
}

function columnLabel(column: Column<StripeSubscriberRow, unknown>) {
    return typeof column.columnDef.header === 'string'
        ? column.columnDef.header
        : column.id;
}

function isCheckoutHandleMetadataColumn(column: MetadataColumn) {
    return checkoutHandleKind(column) !== null;
}

function checkoutHandleOrder(column: MetadataColumn) {
    return checkoutHandleKind(column) === 'discord' ? 0 : 1;
}

function checkoutHandleKind(column: MetadataColumn) {
    if (!column.key.startsWith(checkoutCustomFieldPrefix)) {
        return null;
    }

    const normalized = `${column.key.slice(checkoutCustomFieldPrefix.length)} ${
        column.label
    }`
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

    if (normalized.includes('discord')) {
        return 'discord';
    }

    if (normalized.includes('tradingview')) {
        return 'tradingview';
    }

    return null;
}

function columnSizeStyle(
    column: Column<StripeSubscriberRow, unknown>,
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
