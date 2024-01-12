'use client';

import { DataTable } from '@/components/data-table'
import { columns, User } from '@/types/User/columns'
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { ErrorResponse } from '@/types/shared/ValidationError';
import { deleteUser, getUsers } from "@/services/User/UserService";
import { UserResponse } from "@/types/User/UserResponse";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { toast } from "sonner";
import { Users2Icon } from 'lucide-react';
import { getIp,logAuditAction } from '@/services/Audit/AuditService';
import { useAuthToken } from '@/hooks/useAuthToken';

export default function Page() {
    const [users, setUsers] = useState<UserResponse[]>([] as UserResponse[]);
    const [errors, setErrors] = useState<ErrorResponse | null>(null);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);
    const router = useRouter();
    const token = useAuthToken();

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
                }
                toast.error(errorData.message.toString());
            }
        }).catch((err) => {
            toast.error('Error deleting user');
        });
    }

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
            <Header title='All Users' icon={<Users2Icon size={26} />} />
            <div>
                <MaxWidthWrapper className='mt-4'>
                    <DataTable<User, string>
                        onCreate={createUserHandler}
                        columns={columns(updateUserHandler, deleteUserHandler)}
                        data={users}
                        filteredColumn='username' />
                </MaxWidthWrapper>
            </div>
        </>
    )
}