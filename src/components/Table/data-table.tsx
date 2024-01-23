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
import { Button } from "../ui/button"
import { Input } from "@/components/ui/input"
import { DataTablePagination } from "./PaginationDataTable"
import React, { useState } from "react"
import { DataTableToolbar } from '@/components/Table/data-table-toolbar';
import { PDFGenerator } from "@/components/Table/PDFGeneratorProps"

import {
    RankingInfo,
    rankItem,
} from '@tanstack/match-sorter-utils'

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
    onSelectionChange?: (selectedRows: number[]) => void;
    reportRelationData?: TData[];
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
    onSelectionChange,
    reportRelationData,
}: DataTableProps<TData, TValue>) {

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [rowSelection, setRowSelection] = React.useState({})
    const [generatePdfClicked, setGeneratePdfClicked] = React.useState(false);
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
        initialState: {
            pagination: { pageSize: 5 },
        },
    })

    //Generar cvs
    const exportData = data.map((row) =>
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
    //fin generar cvs

    React.useEffect(() => {
        if (onSelectionChange) {
            const selectedRowIds = Object.entries(rowSelection)
                .filter(([key, value]) => value)
                .map(([key]) => (data[parseInt(key)] as any).id);
            if (selectedRowIds.length > 0) {
                onSelectionChange(selectedRowIds);
            }
        }
        setGeneratePdfClicked(false);
    }, [rowSelection]);

    return (
        <>
            <div className="flex justify-between mb-3">
                <DataTableToolbar table={table} />

                {/* Reporte */}
                <PDFGenerator
                    table={table}
                    moduleName={moduleName}
                    description={description}
                    reportRelationData={reportRelationData}
                    setGeneratePdfClicked={setGeneratePdfClicked}
                />

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
        </>
    )
}
