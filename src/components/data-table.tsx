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
import React from "react"
import { useUserFunctions } from '@/contexts/UserFunctionProvider';

import {
    RankingInfo,
    rankItem,
    compareItems,
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
    onCreate?: () => void
    filteredColumn: string
    canCreate?: boolean
    canUpdate?: boolean
    canDelete?: boolean
    canRead?: boolean
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
    onCreate,
    filteredColumn,
    canCreate: canCreate,
    canUpdate: canUpdate,
    canDelete: canDelete
}: DataTableProps<TData, TValue>) {

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState('')
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
        state: {
            columnFilters,
            globalFilter,
            sorting,
        },
        initialState: { pagination: { pageSize: 7 } },
    })

    return (
        <>
            <div className="flex justify-between mb-3">
                {/* Global filter */}
                <div>
                    <Input
                        placeholder="Global Filter..."
                        value={globalFilter}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="max-w-sm"
                    />
                </div>
                {/* Crear */}
                {onCreate && canCreate ?
                    (<div className="">
                        <Button onClick={onCreate}>
                            <span> Create </span>
                        </Button>
                    </div>)
                    : ""
                }

            </div>
            {/* table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>

                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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
                                        <TableCell key={cell.id}>
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
