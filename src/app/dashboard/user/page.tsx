'use client';

import { DataTable } from '@/components/Table/data-table'
import { useColumns, User } from '@/types/User/columns'
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { ErrorResponse } from '@/types/shared/ValidationError';
import { deleteUser, getRolesOfUser, getUser, getUsers } from "@/services/User/UserService";
import { UserResponse } from "@/types/User/UserResponse";

import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from "react";
import Header from '@/components/Header';
import { toast } from "sonner";
import { Users2Icon } from 'lucide-react';
import { useUserFunctions } from '@/contexts/UserFunctionProvider';
import validFunctions from '@/providers/ValidateFunctions'
import { getIp, logAuditAction } from '@/services/Audit/AuditService';
import { useAuthToken } from '@/hooks/useAuthToken';
import React from 'react';
import { RoleResponse } from '@/types/Role/RoleResponse';
import { set } from 'zod';
import { FunctionResponse } from '@/types/Function/FunctionResponse';
import { getFunctionsOfRole } from '@/services/Role/RoleService';

function Page() {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [user, setUser] = useState<UserResponse | null>(null);
    const [errors, setErrors] = useState<ErrorResponse | null>(null);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);
    const [selectedUserRoles, setSelectedUserRoles] = React.useState([]);
    const [reporUserRoles, setReportUserRoles] = React.useState<UserResponse[]>([]);

    const router = useRouter();
    const token = useAuthToken();

    const userFunctions = useUserFunctions();

    const isFunctionCreateUser = userFunctions?.includes('SEC-USERS-CREATE') || false;

    const createObjectFromSelectedRows = () => {
        const myObject = {};
    };

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
                toast.error(errorData.message.toString());
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

                const errorData: ErrorResponse = await res.json();
                toast.error(errorData.message.toString());
            }
        }).catch((err) => {
            toast.error('An error has occurred');
        });
    }

    const getUserHandler = async (id: number): Promise<UserResponse> => {
        const res = await getUser(id, token);
        if (res.status === 200) {
            const data: UserResponse = await res.json();
            return data;
        } else {
            const errorData: ErrorResponse = await res.json();
            toast.error(errorData.message.toString());
            throw new Error(errorData.message);
        }
    }

    const getRolesOfUserHandler = async (id: number): Promise<RoleResponse[]> => {
        const res = await getRolesOfUser(id, token);
        if (res.status === 200) {
            const data: RoleResponse[] = await res.json();
            return data;
        } else {
            const errorData: ErrorResponse = await res.json();
            toast.error(errorData.message.toString());
            throw new Error(errorData.message);
        }
    }

    const getFunctionsOfRoleHandler = async (roleId: number): Promise<FunctionResponse[]> => {
        const res = await getFunctionsOfRole(roleId, token);
        if (res.status === 200) {
            const data: FunctionResponse[] = await res.json();
            const filteredFunctions: FunctionResponse[] = data.filter((function_: FunctionResponse) => function_.status === true);
            return filteredFunctions;
        } else {
            const errorData: ErrorResponse = await res.json();
            toast.error(errorData.message.toString());
            throw new Error(errorData.message);
        }
    }

    const handleSelectionChange = async (selectedRows: number[]) => {
        if (selectedRows.length > 0) {
            const userReports: UserResponse[] = [];
            for (const row of selectedRows) {
                try {
                    const user = await getUserHandler(row);
                    const roles = await getRolesOfUserHandler(row);
                    const rolesWithFunctions = [];
                    for (const role of roles) {
                        const functions = await getFunctionsOfRoleHandler(role.id);
                        rolesWithFunctions.push({ ...role, functions });
                    }
                    userReports.push({ ...user, roles: rolesWithFunctions });
                } catch (error) {
                    toast.error('An error has occurred while fetching user, roles or functions');
                }
            }
            setReportUserRoles(userReports);
            // console.log(userReports);
        }
    };

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
                        onSelectionChange={handleSelectionChange}
                        reportRelationData={reporUserRoles}
                    />
                </MaxWidthWrapper>
            </div>
        </>
    )
}

export default validFunctions(Page, 'SEC-USERS-READ');