import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Checkbox } from "@/components/registry/new-york/ui/checkbox"
import { DataTableColumnHeader } from "@/components/Table/data-table-column-header";
import IndeterminateCheckbox from "@/components/Table/IndeterminateCheckbox";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export type Audit = {
    id: number;
    action: string;
    description: string;
    observation: string;
    ip: string;
    date: Date;
    user: string;
    functionName?: string;
}

export const columns = (handleUpdate: (id: number) => void, handleDelete:
    (id: number) => void): ColumnDef<Audit>[] =>
    [
        {
            id: 'select',
            header: ({ table }) => (
                <IndeterminateCheckbox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                />
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <IndeterminateCheckbox
                        {...{
                            checked: row.getIsSelected(),
                            disabled: !row.getCanSelect(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                    />
                </div>
            ),
        },
        {
            id: "actions",
            header: 'Actions',
            cell: ({ row }) => {
                const audit = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(audit.id.toString())}
                            >
                                Copy function ID
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
        {
            accessorKey: "id",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="ID" />
            ),
            cell: ({ row }) => {
                const id = row.original
                return (
                    <span className="font-normal">
                        {String(row.getValue("id"))}
                    </span>
                )
            },
            filterFn: (row, id, value) => {
                return (row.getValue(id) as string).includes(value)
            },
        }, {
            accessorKey: "date",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Date" />
            ),
            cell: ({ row }) => {
                const id = row.original
                return (
                    <span className="max-w-[500px] font-normal">
                        {String(row.getValue("date"))}
                    </span>
                )
            },
            filterFn: (row, id, value) => {
                return (row.getValue(id) as string).includes(value)
            },
        },
        {
            accessorKey: "user",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="User" />
            ),
            cell: ({ row }) => {
                const id = row.original
                return (
                    <span className="max-w-[500px] truncate font-normal">
                        {String(row.getValue("user"))}
                    </span>
                )
            },
            filterFn: (row, id, value) => {
                return (row.getValue(id) as string).includes(value)
            },
        },
        {
            accessorKey: "action",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Action" />
            ),
            cell: ({ row }) => {
                const audit = row.original
                return (
                    <span className="max-w-[500px] truncate font-normal">
                        {audit.action}
                    </span>
                )
            },
            filterFn: (row, id, value) => {
                return (row.getValue(id) as string).includes(value)
            },
        },
        {
            accessorKey: "description",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Description" />
            ),
            cell: ({ row }) => {
                const audit = row.original
                return (
                    <span className="font-normal">
                        {audit.description}
                    </span>
                )
            },
            filterFn: (row, id, value) => {
                return (row.getValue(id) as string).includes(value)
            },
        },
        {
            accessorKey: "observation",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Observation" />
            ),
            cell: ({ row }) => {
                const audit = row.original
                return (
                    <span className="max-w-[100px] font-normal">
                        {audit.observation}
                    </span>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "ip",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="IP" />
            ),
            cell: ({ row }) => {
                const audit = row.original
                return (
                    <span className="max-w-[100px] font-normal">
                        {audit.ip}
                    </span>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            accessorKey: "functionName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Function" />
            ),
            cell: ({ row }) => {
                const audit = row.original
                return (
                    <span className="max-w-[100px] font-normal">
                        {audit.functionName}
                    </span>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },


    ]
