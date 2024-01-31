import { ColumnDef } from "@tanstack/react-table";
import Module from "../../app/dashboard/module/page";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserFunctions } from "@/contexts/UserFunctionProvider";

import { DataTableColumnHeader } from "@/components/Table/data-table-column-header";
import { statuses } from "@/components/Table/data/data";
import { Checkbox } from "@/components/registry/new-york/ui/checkbox"
import IndeterminateCheckbox from "@/components/Table/IndeterminateCheckbox";

export type Module = {
    id: number;
    name: string;
    description: string;
    status: boolean;
}

export const useColumns = (handleUpdate: (id: number) => void, handleDelete: (id: number) => void): ColumnDef<Module>[] => {
    const userFunctions = useUserFunctions();
    const isFunctionDelete = userFunctions?.includes('SEC-MODULES-DELETE') || false;
    const isFunctionUpdate = userFunctions?.includes('SEC-MODULES-UPDATE') || false;

    return [
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
                const module_ = row.original

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
                                onClick={() => navigator.clipboard.writeText(module_.id.toString())}
                            >
                                Copy Module ID
                            </DropdownMenuItem>
                            {isFunctionUpdate || isFunctionDelete ? (
                                <DropdownMenuSeparator />
                            ) : null
                            }
                            {isFunctionUpdate ? (
                                <DropdownMenuItem onClick={() => handleUpdate(module_.id)}>
                                    Edit Module
                                </DropdownMenuItem>
                            ) : null}

                            {isFunctionDelete ? (
                                <DropdownMenuItem onClick={() => handleDelete(module_.id)}>
                                    Delete Module
                                </DropdownMenuItem>
                            ) : null}
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
                    <span className="max-w-[500px] truncate font-normal">
                        {row.getValue("id")}
                    </span>
                )
            },
            filterFn: (row, id, value) => {
                return (row.getValue(id) as string).includes(value)
            },
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
            cell: ({ row }) => {
                const module_ = row.original
                return (
                    <span className="max-w-[500px] truncate font-normal">
                        {row.getValue("name")}
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
                const module_ = row.original
                return (
                    <span className="max-w-[500px] truncate font-normal">
                        {row.getValue("description")}
                    </span>
                )
            },
            filterFn: (row, id, value) => {
                return (row.getValue(id) as string).includes(value)
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                const status = statuses.find(
                    (status) => status.value === row.getValue("status")
                )

                if (!status) {
                    return null
                }

                return (
                    <div className="flex justify-center items-center">
                        {status.icon && (
                            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        )}
                        <span>{status.label}</span>
                    </div>
                )
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id))
            },
        },

    ]
}