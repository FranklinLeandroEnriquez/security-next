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

export function RelacionalAuditUser<TData>({
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

    const getUsersHandler = useCallback(async (ids: number[]): Promise<UserResponse[]> => {
        const users: UserResponse[] = [];

        for (const id of ids) {
            try {
                const user = await getUserHandler(id);
                users.push(user);
            } catch (error) {
                console.error(`Error obteniendo el usuario con ID ${id}: ${error}`);
            }
        }
        return users;
    }, [getUserHandler]);

    const sizePagination = table?.getState().pagination.pageSize || 0;
    const currentPage = table?.getState().pagination.pageIndex || 0;


    const getAuditHandler = useCallback(async (id: number): Promise<AuditResponse & { users: UserResponse[] }> => {
        const res = await getAudit(id, token);
        if (res.status === 200) {
            const data: AuditResponse = await res.json();
            const skip = currentPage * sizePagination;
            const take = sizePagination;
            const userRes = await getAuditByUser(id, token, skip, take);
            if (userRes.status === 200) {
                const users: UserResponse[] = await userRes.json();
                return {
                    ...data,
                    users
                };
            } else {
                const errorData: ErrorResponse = await userRes.json();
                toast.error(errorData.message.toString());
                throw new Error(errorData.message);
            }
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
            // Ordena las auditorías de menor a mayor
            const sortedAudits = audits.sort((a, b) => a.id - b.id);
            setAudits(sortedAudits);
        });
    }, []);


    return (
        <ReportHeader data={data} dataType='Audits' />
    );
}

export default RelacionalAuditUser;