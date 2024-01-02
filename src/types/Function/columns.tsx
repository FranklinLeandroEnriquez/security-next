import { ColumnDef } from "@tanstack/react-table";
import Function from "../../app/dashboard/function/page";
import { MoreHorizontal } from "lucide-react";

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

export type Function = {
    id: number;
    name: string;
    module: ModuleResponse;
    status: boolean;
}

export const columns = (handleUpdate: (id: number) => void, handleDelete:
    (id: number) => void): ColumnDef<Function>[] =>
    [{
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Name",

    },
    {
        accessorKey: "module",
        header: "Module",
        cell: ({ row }) => {
            const module = row.original

            return (
                <span>{module.module.name}</span>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        id: "actions",
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => handleUpdate(function_.id)}
                        >
                            Update
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDelete(function_.id)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]