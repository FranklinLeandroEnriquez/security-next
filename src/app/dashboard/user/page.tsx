'use client';

import { DataTable } from '@/components/Table/data-table'
import { useColumns, User } from '@/types/User/columns'
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { ErrorResponse } from '@/types/shared/ValidationError';
import { deleteUser, getUsers } from "@/services/User/UserService";
import { UserResponse } from "@/types/User/UserResponse";
//Obtener los roles del usuario
import { RoleResponse } from "@/types/Role/RoleResponse";
import { getRolesOfUser } from "@/services/User/UserService";
import { getRoles } from "@/services/Role/RoleService";
import { getRolesOfUserHandler } from "@/handlers/userRolesHandler"

import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from "react";
import Header from '@/components/Header';
import { toast } from "sonner";
import { Users2Icon } from 'lucide-react';
import { useUserFunctions } from '@/contexts/UserFunctionProvider';
import validFunctions from '@/providers/ValidateFunctions'
import { getIp, logAuditAction } from '@/services/Audit/AuditService';
import { useAuthToken } from '@/hooks/useAuthToken';

type Row = {
    isSelected: boolean;
    user: User;
}

function Page() {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [errors, setErrors] = useState<ErrorResponse | null>(null);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);

    const router = useRouter();
    const token = useAuthToken();

    const userFunctions = useUserFunctions();

    const isFunctionCreateUser = userFunctions?.includes('SEC-USERS-CREATE') || false;

    const deleteUserHandler = async (id: number) => {
        const ip = await getIp();
        await deleteUser(id, token).then(async (res) => {
            if (res.status === 200) {
                await logAuditAction({
                    functionName: 'SEC-USERS-DELETE',
                    action: 'delete user',
                    description: 'Successfully deleted user',
                    observation: `User id: ${id}`,
                    ip: ip.toString(),
                }, token);
                getUsersLocal();
                toast.success("User deleted successfully");
            } else {
                await logAuditAction({
                    functionName: 'SEC-USERS-DELETE',
                    action: 'delete user',
                    description: 'Failed to delete user',
                    ip: ip.toString(),
                }, token);
                const errorData: ErrorResponse = await res.json();
                if (errorData.error === 'ErrorResponse') {
                    setErrorResponse(null);
                    setErrors(errorData);
                    toast.error(errorData.message.toString());
                } else {
                    toast.error(errorData.message.toString());
                }
            }
        });
    };

    const updateUserHandler = async (id: number) => {
        router.push(`/dashboard/user/update/${id}`);
    }

    const createUserHandler = async () => {
        router.push(`/dashboard/user/create`);
    }

    const getUsersLocal = async () => {
        const ip = await getIp();
        getUsers(token).then(async (res) => {
            if (res.status === 200) {
                await logAuditAction({
                    functionName: 'SEC-USERS-READ',
                    action: 'get Users',
                    description: 'Successfully fetched users',
                    ip: ip.toString(),

                }, token);
                return res.json().then((data) => {
                    setUsers(data);
                });
            } else {
                await logAuditAction({
                    functionName: 'SEC-USERS-READ',
                    action: 'get Users',
                    description: 'Failed to fetch users',
                    ip: ip.toString(),
                }, token);
                toast.error('An error has occurred');

            }
        }).catch((err) => {
            toast.error('An error has occurred');
        });
    }

    useEffect(() => {
        getUsersLocal();
    }, []);

    //Obtener los roles del usuario

    return (
        <>
            <Header title='All Users' icon={<Users2Icon size={26} />} />
            <div>
                <MaxWidthWrapper className='my-5'>
                    <DataTable<User, string>
                        moduleName="Users"
                        description="Users of the system"
                        canCreate={isFunctionCreateUser}
                        onCreate={createUserHandler}
                        columns={useColumns(updateUserHandler, deleteUserHandler)}
                        data={users}

                    />
                </MaxWidthWrapper>
            </div>
        </>
    )
}

export default validFunctions(Page, 'SEC-USERS-READ');