import React, { useCallback, useEffect, useState } from 'react';
import { AuditResponse } from '@/types/Audit/AuditResponse';
import { getAudit, getAuditByUser } from '@/services/Audit/AuditService';
import { useAuthToken } from '@/hooks/useAuthToken';
import { ErrorResponse } from '@/types/shared/ValidationError';
import { toast } from 'sonner';
import { ReporType } from '@/types/Reports/shared/Report';
import { renderData } from '@/types/Reports/shared/FormatData';
import { ReportHeader } from "@/types/Reports/shared/HeaderReport";
import { UserResponse } from '@/types/User/UserResponse';
import { getUser } from '@/services/User/UserService';

interface UserAuditReport {
    user: UserResponse;
    audits: AuditResponse[];
}

export function RelacionalAuditUser<TData>({
    table,
}: ReporType<TData>) {
    const [dataReport, setDataReport] = useState<UserAuditReport[]>([]);
    const token = useAuthToken();

    const getIdSelectedItems = useCallback((): number[] => {
        const selectedIds = table?.getSelectedRowModel().flatRows.map((row) => {
            const id = (row.original as any).id;
            return id as number;
        });
        return selectedIds || [];
    }, [table]);

    const getUserHandler = useCallback(async (id: number): Promise<UserResponse> => {
        const res = await getUser(id, token);
        if (res.status === 200) {
            const data: UserResponse = await res.json();
            return data;
        } else {
            const errorData: ErrorResponse = await res.json();
            toast.error(errorData.message.toString());
            throw new Error(errorData.message);
        }
    }, [token]);


    const getAuditsByUserHandler = useCallback(async (userId: number): Promise<AuditResponse[]> => {
        const userRes = await getAuditByUser(userId, token, 20);
        if (userRes.status === 200) {
            return await userRes.json()
        } else {
            const errorData: ErrorResponse = await userRes.json();
            toast.error(errorData.message.toString());
            throw new Error(errorData.message);
        }
    }, [token]);

    const getDataReport = useCallback(async (ids: number[]): Promise<UserAuditReport[]> => {
        const users: UserAuditReport[] = [];

        for (const id of ids) {
            try {
                users.push({
                    user: await getUserHandler(id),
                    audits: await getAuditsByUserHandler(id)
                });
            } catch (error) {
                console.error(`Error obteniendo el usuario con ID ${id}: ${error}`);
            }
        }
        return users;
    }, [getUserHandler, getAuditsByUserHandler]);



    const data = renderData(dataReport, 0, "USER AUDIT");

    useEffect(() => {
        const ids = getIdSelectedItems();
        getDataReport(ids).then((dataReport) => {
            setDataReport(dataReport);

        });
    }, []);


    return (
        <ReportHeader data={data} dataType='USER AUDIT' />
    );
}

export default RelacionalAuditUser;