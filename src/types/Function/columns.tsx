import { ColumnDef } from "@tanstack/react-table";
import Function from "../../app/dashboard/function/page";
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
import { ModuleResponse } from "../Module/ModuleResponse";
import { useUserFunctions } from "@/contexts/UserFunctionProvider";

export type Function = {
    id: number;
    name: string;
    module: ModuleResponse;
    status: boolean;
}

export const useColumns = (handleUpdate: (id: number) => void, handleDelete: (id: number) => void): ColumnDef<Function>[] => {
    const userFunctions = useUserFunctions();
    const isFunctionDelete = userFunctions?.includes('SEC-FUNCTIONS-DELETE') || false;
    const isFunctionUpdate = userFunctions?.includes('SEC-FUNCTIONS-UPDATE') || false;
    return [
        {
            id: "actions",
            header: 'Actions',
            cell: ({ row }) => {
                const function_ = row.original

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
                                onClick={() => navigator.clipboard.writeText(function_.id.toString())}
                            >
                                Copy function ID
                            </DropdownMenuItem>
                            {isFunctionUpdate || isFunctionDelete ? (
                                <DropdownMenuSeparator />
                            ) : null
                            }
                            {isFunctionUpdate ? (
                                <DropdownMenuItem onClick={() => handleUpdate(function_.id)}>
                                    Edit User
                                </DropdownMenuItem>
                            ) : null}

                            {isFunctionDelete ? (
                                <DropdownMenuItem onClick={() => handleDelete(function_.id)}>
                                    Delete User
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
            accessorKey: "module",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Module
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const module_ = row.original

                return (
                    <span>{module_.module.name}</span>
                )
            }
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