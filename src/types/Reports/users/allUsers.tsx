import React, { useCallback, useEffect } from 'react';
import { UserResponse } from '@/types/User/UserResponse';
import { getUser } from '@/services/User/UserService';
import { useAuthToken } from '@/hooks/useAuthToken';
import { ErrorResponse } from '@/types/shared/ValidationError';
import { toast } from 'sonner';
import { ReporType } from '@/types/Reports/shared/Report';
import { renderData } from '@/types/Reports/shared/FormatData';
import {ReportHeader} from "@/types/Reports/shared/HeaderReport";

export function BasicUsers<TData>({
    table,
}: ReporType<TData>) {

    const [users, setUsers] = React.useState<UserResponse[]>([]);

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

    const data = renderData(users, 0, "User");

    useEffect(() => {
        const ids = getIdSelectedItems();
        getUsersHandler(ids).then((users) => {
            setUsers(users);
        });
    }, []);

    return (
        <ReportHeader data={data} dataType={"Users"}/>
    );
};

export default BasicUsers;