import { ColumnDef } from "@tanstack/react-table";
import Module from "../../app/dashboard/module/page";
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

export type Module = {
    id: number;
    name: string;
    description: string;
    status: boolean;
}

export const columns = (handleUpdate: (id: number) => void, handleDelete:
    (id: number) => void): ColumnDef<Module>[] =>
    [

        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const module = row.original

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
                                onClick={() => navigator.clipboard.writeText(module.id.toString())}
                            >
                                Copy module ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUpdate(module.id)}>
                                Edit module
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(module.id)}>
                                Delete module
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]