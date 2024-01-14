import { CSVLink } from 'react-csv';
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
import { DataTableToolbar } from '@/components/Table/data-table-toolbar';

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
}

interface Row {
    isSelected: boolean;
    original: {
        id: string;
        username: string;
        email: string;
        dni: string;
        status: boolean;

    };
}

const handleGenerateReport = (rows: Row[]) => {

    // console.log('handleGenerateReport called with rows:', rows);

    const selectedRows = rows.filter((row) => row.isSelected);
    // console.log('selectedRows:', selectedRows);

    const report = selectedRows.map((row) => {
        // Procesa la información de cada fila según tus necesidades
        return {
            id: row.original.id,
            username: row.original.username,
            email: row.original.email,
            dni: row.original.dni,
            status: row.original.status,
        };
    });
    console.log('report:', report);
};


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
    canCreate: canCreate,
}: DataTableProps<TData, TValue>) {

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [rowSelection, setRowSelection] = React.useState({})
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
                    const rows: Row[] = table.getRowModel().rows.map(row => ({
                        isSelected: row.getIsSelected(),
                        original: row.original
                    }));
                    handleGenerateReport(rows);
                }}>
                    Generar informe
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
            <div>
                <label>Row Selection State:</label>
                <pre>{JSON.stringify(table.getState().rowSelection, null, 2)}</pre>
            </div>
        </>
    )
}
