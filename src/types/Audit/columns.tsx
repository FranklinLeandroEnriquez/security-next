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
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "date",
            header: "Date",
        },
        {
            accessorKey: "user",
            header: "User",
        },
        {
            accessorKey: "action",
            header: "Action",
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            accessorKey: "observation",
            header: "Observation",
        },
        {
            accessorKey: "ip",
            header: "IP",
        },
        {
            accessorKey: "functionName",
            header: "Function",
        },
        {
            id: "actions",
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
    ]
