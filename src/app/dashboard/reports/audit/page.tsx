'use client'

import Header from "@/components/Header";
import { getAudits } from "@/services/Audit/AuditService";
import { AuditResponse } from "@/types/Audit/AuditResponse";
import { useEffect, useState } from "react"
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { DataTable } from "@/components/data-table";
import { Audit, columns } from "@/types/Audit/columns";

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

    const deleteRoleHandler = async (id: number) => { }

    const updateRoleHandler = async (id: number) => { }

    return (
        <>
            <Header title='Audit Trails' />
            <MaxWidthWrapper className='mt-4'>
                <DataTable<Audit, string>
                    columns={columns(updateRoleHandler, deleteRoleHandler)}
                    data={audits}
                    filteredColumn='user'
                />
            </MaxWidthWrapper>
        </>
    );
}
