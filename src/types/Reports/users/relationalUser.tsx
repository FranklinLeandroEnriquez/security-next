import React, { useCallback, useEffect } from 'react';
import { UserResponse } from '@/types/User/UserResponse';
import { RoleResponse } from '@/types/Role/RoleResponse';
import { FunctionResponse } from '@/types/Function/FunctionResponse';
import { getUser } from '@/services/User/UserService';
import { useAuthToken } from '@/hooks/useAuthToken';
import { ErrorResponse } from '@/types/shared/ValidationError';
import { toast } from 'sonner';
import { ReporType } from '@/types/Reports/shared/Report';
import { renderData } from '@/types/Reports/shared/FormatData';
import { ReportHeader } from "@/types/Reports/shared/HeaderReport";
import { getRolesOfUser } from '@/services/User/UserService';
import { getFunctionsOfRole } from '@/services/Role/RoleService';
import { ModuleResponse } from '@/types/Module/ModuleResponse';

export function RelationalUsers<TData>({
    table,
}: ReporType<TData>) {

    const [users, setUsers] = React.useState<(UserResponse & { roles: RoleResponse[] })[]>([]);

    const token = useAuthToken();

    const getIdSelectedItems = useCallback((): number[] => {
        const selectedIds = table?.getSelectedRowModel().flatRows.map((row) => {
            const id = (row.original as any).id;
            return id as number;
        });
        return selectedIds || [];
    }, [table]);

    const groupByModule = (functions: FunctionResponse[]) => {
        console.log("functions in groupByModule");
        console.log(functions);
        let grouped = functions.reduce((acc, function_) => {
            let moduleId = function_.module?.id;
            if (!moduleId) return acc;
            if (!acc[moduleId]) {
                acc[moduleId] = {
                    module: function_.module,
                    functions: [],
                };
            }
            acc[moduleId].functions.push(function_);
            return acc;
        }, {} as Record<number, { module: ModuleResponse, functions: FunctionResponse[] }>);

        return Object.values(grouped);
    };
    const getFunctionsOfRoleHandler = useCallback(async (roleId: number): Promise<FunctionResponse[]> => {
        const res = await getFunctionsOfRole(roleId, token);
        if (res.status === 200) {
            const data: FunctionResponse[] = await res.json();
            console.log("data");
            console.log(data);
            const filteredFunctions: FunctionResponse[] = data.filter((function_: FunctionResponse) => function_.status === true);
            console.log("filteredFunctions");
            console.log(filteredFunctions);
            return filteredFunctions;
        } else {
            const errorData: ErrorResponse = await res.json();
            toast.error(errorData.message.toString());
            throw new Error(errorData.message);
        }
    }, [token]);

    const getRolesOfUserHandler = useCallback(async (userId: number): Promise<RoleResponse[]> => {
        const res = await getRolesOfUser(userId, token);
        if (res.status === 200) {
            const data: RoleResponse[] = await res.json();
            const filteredRoles: RoleResponse[] = data.filter((role: RoleResponse) => role.status === true);
            return filteredRoles;
        } else {
            const errorData: ErrorResponse = await res.json();
            toast.error(errorData.message.toString());
            throw new Error(errorData.message);
        }
    }, [token]);

    const getUserHandler = useCallback(async (id: number): Promise<UserResponse & { roles: RoleResponse[] }> => {
        const res = await getUser(id, token);
        if (res.status === 200) {
            const data: UserResponse = await res.json();
            try {
                const rolesData: RoleResponse[] = await getRolesOfUserHandler(id);
                // Fetch the functions of each role and group them by module
                const rolesWithGroupedFunctions = await Promise.all(rolesData.map(async (role) => {
                    const functions = await getFunctionsOfRoleHandler(role.id);
                    console.log("functions in getUserHandler");
                    console.log(functions);
                    const groupedFunctions = groupByModule(functions);
                    return { ...role, modules: groupedFunctions };
                }));
                return { ...data, roles: rolesWithGroupedFunctions };

            } catch (error) {
                toast.error("An error has ocurred");
                throw error;
            }
        } else {
            const errorData: ErrorResponse = await res.json();
            toast.error(errorData.message.toString());
            throw new Error(errorData.message);
        }
    }, [token, getRolesOfUserHandler, getFunctionsOfRoleHandler, groupByModule]);

    const getUsersHandler = useCallback(async (ids: number[]): Promise<(UserResponse & { roles: RoleResponse[] })[]> => {
        const users: (UserResponse & { roles: RoleResponse[] })[] = [];

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
        <ReportHeader data={data} dataType={"Users"} />
    );
};

export default RelationalUsers;