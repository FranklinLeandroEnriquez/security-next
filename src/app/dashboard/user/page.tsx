'use client';

import { DataTable } from '@/components/Table/data-table'
import { useColumns, User } from '@/types/User/columns'
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { ErrorResponse } from '@/types/shared/ValidationError';
import { deleteUser, getUsers } from "@/services/User/UserService";
import { UserResponse } from "@/types/User/UserResponse";

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from "react";
import Header from '@/components/Header';
import { toast } from "sonner";
import { FaUsers } from 'react-icons/fa';
import { useUserFunctions } from '@/contexts/UserFunctionProvider';
import validFunctions from '@/providers/ValidateFunctions'
import { getIp, logAuditAction } from '@/services/Audit/AuditService';
import { useAuthToken } from '@/hooks/useAuthToken';
import React from 'react';
import { userRports } from "@/types/Reports/users/userReports"

function Page() {
    const [users, setUsers] = useState<UserResponse[]>([]);


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
                toast.error('An error has occurred');

            }
        }).catch((err) => {
            toast.error('An error has occurred');
        });
    }

    useEffect(() => {
        getUsersLocal();
    }, []);

    return (
        <>
            <Header title='All Users' icon={<FaUsers size={26} />} />
            <div>
                <MaxWidthWrapper className='my-5'>
                    <DataTable<User, string>
                        moduleName="Users"
                        description="Users of the system"
                        canCreate={isFunctionCreateUser}
                        onCreate={createUserHandler}
                        columns={useColumns(updateUserHandler, deleteUserHandler)}
                        data={users}
                        reports={userRports()}
                    />
                </MaxWidthWrapper>
            </div>
        </>
    )
}

export default validFunctions(Page, 'SEC-USERS-READ');