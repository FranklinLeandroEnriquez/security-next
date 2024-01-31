import React, { useCallback, useEffect, useState } from 'react';
import { AuditResponse } from '@/types/Audit/AuditResponse';
import { getAudit } from '@/services/Audit/AuditService';
import { useAuthToken } from '@/hooks/useAuthToken';
import { ErrorResponse } from '@/types/shared/ValidationError';
import { toast } from 'sonner';
import { ReporType } from '@/types/Reports/shared/Report';
import { renderData } from '@/types/Reports/shared/FormatData';
import { ReportHeader } from "@/types/Reports/shared/HeaderReport";
import { getAudits, getIp, logAuditAction } from '@/services/Audit/AuditService';

export function allAudit<TData>({
    table,
}: ReporType<TData>) {
    const [audits, setAudits] = useState<AuditResponse[]>([]);
    const token = useAuthToken();

    const getIdSelectedItems = useCallback((): number[] => {
        const selectedIds = table?.getSelectedRowModel().flatRows.map((row) => {
            const id = (row.original as any).id;
            return id as number;
        });
        return selectedIds || [];
    }, [table]);

    const getAuditHandler = useCallback(async (id: number): Promise<AuditResponse> => {
        const res = await getAudit(id, token);
        if (res.status === 200) {
            const data: AuditResponse = await res.json();
            return data;
        } else {
            const errorData: ErrorResponse = await res.json();
            toast.error(errorData.message.toString());
            throw new Error(errorData.message);
        }
    }, [token]);

    const getAuditsHandler = useCallback(async (ids: number[]): Promise<AuditResponse[]> => {
        const audits: AuditResponse[] = [];

        for (const id of ids) {
            try {
                const audit_ = await getAuditHandler(id);
                audits.push(audit_);
            } catch (error) {
                console.error(`Error obteniendo el usuario con ID ${id}: ${error}`);
            }
        }
        return audits;
    }, [getAuditHandler]);

    const data = renderData(audits, 0, "Audit");

    useEffect(() => {
        const ids = getIdSelectedItems();
        getAuditsHandler(ids).then((audits) => {
            setAudits(audits);
        });
    }, []);


    return (
        <ReportHeader data={data} dataType='Audits' />
    );
}

export default allAudit;