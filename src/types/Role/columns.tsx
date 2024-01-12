import { ColumnDef } from "@tanstack/react-table";
import Role from "../../app/dashboard/role/page";
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

export type Role = {
    id: number;
    name: string;
    status: boolean;
}

export const useColumns = (handleUpdate: (id: number) => void, handleDelete: (id: number) => void): ColumnDef<Role>[] => {
    const userFunctions = useUserFunctions();
    const isFunctionDelete = userFunctions?.includes('SEC-ROLES-DELETE') || false;
    const isFunctionUpdate = userFunctions?.includes('SEC-ROLES-UPDATE') || false;

    return [
        {
            id: "actions",
            header: 'Actions',
            cell: ({ row }) => {
                const role = row.original

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
                                onClick={() => navigator.clipboard.writeText(role.id.toString())}
                            >
                                Copy Role ID
                            </DropdownMenuItem>
                            {isFunctionUpdate || isFunctionDelete ? (
                                <DropdownMenuSeparator />
                            ) : null
                            }
                            {isFunctionUpdate ? (
                                <DropdownMenuItem onClick={() => handleUpdate(role.id)}>
                                    Edit Role
                                </DropdownMenuItem>
                            ) : null}

                            {isFunctionDelete ? (
                                <DropdownMenuItem onClick={() => handleDelete(role.id)}>
                                    Delete Role
                                </DropdownMenuItem>
                            ) : null}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
        {
            accessorKey: "id",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        ID
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
        },

    ]
}