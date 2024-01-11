'use client'

import Header from "@/components/Header";
import { getAudits } from "@/services/Audit/AuditService";
import { AuditResponse } from "@/types/Audit/AuditResponse";
import { useEffect, useState } from "react"
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { DataTable } from "@/components/data-table";
import { Audit, columns } from "@/types/Audit/columns";
import { getIp, logAuditAction } from "@/services/Audit/AuditService";
import { useAuthToken } from "@/hooks/useAuthToken";
import { ErrorResponse } from "@/types/shared/ValidationError";
import { toast } from "sonner";

export default function AuditReport() {
    const [audits, setAudits] = useState<AuditResponse[]>([]);
    const token = useAuthToken();
    const [errors, setErrors] = useState<ErrorResponse | null>(null);
    useEffect(() => {
        getAudits().then(async(res): Promise<void> => {
            const ip = await getIp();
            if (res.status === 200) {
                logAuditAction({
                    functionName: 'SEC-AUDIT-READ',
                    action: 'get audits',
                    description: 'Successfully fetched audits',
                    ip: ip.toString(),
                }, token);
                res.json().then((data) => {
                    setAudits(data);
                });
            } else {
                logAuditAction({
                    functionName: 'SEC-AUDIT-READ',
                    action: 'get audits',
                    description: 'Failed to fetch audits',
                    ip: ip.toString(),
                }, token);
                const errorData: ErrorResponse = await res.json();
                if (errorData.error === 'ErrorResponse') {
                    setErrors(errorData);
                    toast.error(errorData.message.toString());
                }
                toast.error(errorData.message.toString());
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
