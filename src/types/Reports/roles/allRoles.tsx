import React, { useCallback, useEffect } from 'react';
import { RoleResponse } from '@/types/Role/RoleResponse';
import { getRole } from '@/services/Role/RoleService';
import { useAuthToken } from '@/hooks/useAuthToken';
import { ErrorResponse } from '@/types/shared/ValidationError';
import { toast } from 'sonner';
import { ReporType } from '@/types/Reports/shared/Report';
import { renderData } from '@/types/Reports/shared/FormatData';
import {ReportHeader} from "@/types/Reports/shared/HeaderReport";

export function BasicRoles<TData>({
    table,
}: ReporType<TData>) {

    const [roles, setRoles] = React.useState<RoleResponse[]>([]);

    const token = useAuthToken();

    const getIdSelectedItems = useCallback((): number[] => {
        const selectedIds = table?.getSelectedRowModel().flatRows.map((row) => {
            const id = (row.original as any).id;
            return id as number;
        });
        return selectedIds || [];
    }, [table]);

    const getRoleHandler = useCallback(async (id: number): Promise<RoleResponse> => {
        const res = await getRole(id, token);
        if (res.status === 200) {
            const data: RoleResponse = await res.json();
            return data;
        } else {
            const errorData: ErrorResponse = await res.json();
            toast.error(errorData.message.toString());
            throw new Error(errorData.message);
        }
    }, [token]);

    const getRolesHandler = useCallback(async (ids: number[]): Promise<RoleResponse[]> => {
        const roles: RoleResponse[] = [];

        for (const id of ids) {
            try {
                const role = await getRoleHandler(id);
                roles.push(role);
            } catch (error) {
                console.error(`Error obteniendo el usuario con ID ${id}: ${error}`);
            }
        }
        return roles;
    }, [getRoleHandler]);

    const data = renderData(roles, 0, "Role");

    useEffect(() => {
        const ids = getIdSelectedItems();
        getRolesHandler(ids).then((roles) => {
            setRoles(roles);
        });
    }, []);

    return (
        <ReportHeader data={data} dataType={"Roles"}/>
    );
};

export default BasicRoles;