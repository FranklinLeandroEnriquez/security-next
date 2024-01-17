import { CSVLink } from 'react-csv';
import PDFPreviewDialog from '@/components/ui/ModalReport';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    SortingState,
    getPaginationRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    useReactTable,
    getSortedRowModel,
    FilterFn,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "./ui/button"
import { Input } from "@/components/ui/input"
import { DataTablePagination } from "./PaginationDataTable"
import React, { useState } from "react"
import { DataTableToolbar } from '@/components/Table/data-table-toolbar';

import {
    RankingInfo,
    rankItem,
} from '@tanstack/match-sorter-utils'
import { set } from 'zod';

declare module '@tanstack/table-core' {
    interface FilterFns {
        fuzzy: FilterFn<unknown>
    }
    interface FilterMeta {
        itemRank: RankingInfo
    }
}
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    moduleName: string
    description: string
    onCreate?: () => void
    canCreate?: boolean
    onRowSelectionChange?: (rows: Row<TData>[]) => void;
    onGenerateReport?: (ids: number[]) => void;
    reportData?: any[];
}

// ESTO ES PARA MANEJAR GENERADOR DE INFORMES
interface Row<T> {
    isSelected: boolean;
    data: T;
}


const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)
    // Store the itemRank info
    addMeta({
        itemRank,
    })
    // Return if the item should be filtered in/out
    return itemRank.passed
}

export function DataTable<TData, TValue>({
    columns,
    data,
    moduleName,
    description,
    onCreate,
    canCreate: canCreate,
    onRowSelectionChange,
    onGenerateReport,
    reportData
}: DataTableProps<TData, TValue>) {

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [rowSelection, setRowSelection] = React.useState({})
    const [isPdfPreviewOpen, setPdfPreviewOpen] = useState(false);
    // const [reportData, setReportData] = React.useState<TData[]>([]);
    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),

        getPaginationRowModel: getPaginationRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            columnFilters,
            globalFilter,
            sorting,
            rowSelection,
        },
        initialState: { pagination: { pageSize: 7 } },
    })

    const handleGenerateReport = (rows: Row<TData>[]): TData[] => {
        const selectedRows = rows.filter((row) => row.isSelected);
        const report = selectedRows.map((row) => {
            return row.data;
        });
        return report;
    };

    const rowData: Row<TData>[] = table.getRowModel().rows.map(row => ({
        isSelected: row.getIsSelected(),
        data: row.original
    }));

    const exportData = handleGenerateReport(rowData).map((row) =>
        columns.reduce((acc: Record<string, any>, column) => {
            const accessorKey = (column as any).accessorKey;
            if (accessorKey && accessorKey !== 'actions') {
                let cellValue = (row as Record<string, any>)[accessorKey];
                if (cellValue && typeof cellValue === 'object' && cellValue.name) {
                    cellValue = cellValue.name;  // Use the 'name' property if it's an object
                }
                acc[accessorKey] = cellValue;
            }
            return acc;
        }, {})
    );

    return (
        <>
            <div className="flex justify-between mb-3">
                {/* Global filter */}
                <div className='flex justify-center items-center'>
                    <Input
                        placeholder="Global Filter..."
                        value={globalFilter}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="max-w-sm mr-5"
                    />
                    <DataTableToolbar table={table} />
                </div>
                <Button onClick={() => {
                    const selectedIds = rowData.filter(row => row.isSelected).map(row => (row.data as { id: string }).id);
                    onGenerateReport && onGenerateReport(selectedIds.map(id => parseInt(id, 10)));
                }}>
                    <PDFPreviewDialog
                        title={moduleName}
                        data={reportData || []}
                        description={`${description} Report`}
                        open={isPdfPreviewOpen}
                        onOpenChange={setPdfPreviewOpen}
                    />
                </Button>
                {/* Crear */}
                {onCreate && canCreate ?
                    (<div className=" flex justify-center items-center">
                        {/* Enlace a CSV */}
                        <div className='mr-3'>
                            <CSVLink data={exportData} filename="table_data.csv" separator=';'>
                                <Button variant='ghost'>Export to CSV</Button>
                            </CSVLink>
                        </div>
                        {/* table */}
                        <Button onClick={onCreate}>
                            <span> Create </span>
                        </Button>
                    </div>)
                    : ""
                }
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead className="text-center" key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell className="text-center" key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* pagination */}
            <DataTablePagination table={table} />
            {/* <div>
                <label>Row Selection State:</label>
                <pre>{JSON.stringify(table.getState().rowSelection, null, 2)}</pre>
            </div> */}
        </>
    )
}
