'use client'

import Header from "@/components/Header";
import { getAudits } from "@/services/Audit/AuditService";
import { AuditResponse } from "@/types/Audit/AuditResponse";
import { useEffect, useState } from "react"
import { UsersRound } from 'lucide-react';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";

export default function AuditReport() {
    const [audits, setAudits] = useState<AuditResponse[]>([]);

    useEffect(() => {
        getAudits().then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    setAudits(data);
                });
            }
        });
    }, []);


    return (
        <>
            <Header title='Audit Trails' />
            <MaxWidthWrapper className='mt-4'>
                <DataTable<AuditResponse, string>
                    columns={column()}
                    data={audits}
                    filteredColumn='user'
                />
            </MaxWidthWrapper>
        </>
    );
}

export const column = (): ColumnDef<AuditResponse>[] => [
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
    }
]
