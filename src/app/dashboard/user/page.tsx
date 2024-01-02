'use client';

import { DataTable } from '@/components/data-table'
import { columns, User } from '@/types/User/columns'
import MaxWidthWrapper from "@/components/MaxWidthWrapper"

import { deleteUser, getUsers } from "@/services/User/UserService";
import { UserResponse } from "@/types/User/UserResponse";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { toast } from "sonner";
import { Users2Icon} from 'lucide-react';

export default function Page() {
    const [users, setUsers] = useState<UserResponse[]>([] as UserResponse[]);

    const router = useRouter();

    const deleteUserHandler = async (id: number) => {
        await deleteUser(id).then((res) => {
            if (res.status === 200) {
                getUsersLocal();
                toast.success("User deleted successfully");
            }else{
                toast.error('Error deleting user.');
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
        getUsers().then(async (res) => {
            if (res.status === 200) {
                return res.json().then((data) => {
                    setUsers(data);
                });
            }
            toast.error('An error has occurred');
        }).catch((err) => {
            toast.error('An error has occurred');
        });
    }

    useEffect(() => {
        getUsersLocal();
    }, []);

    return (
        <>
            <Header title='All Users' icon= {<Users2Icon/>} />
            <MaxWidthWrapper className='mt-4'>
                <DataTable<User, string> onCreate={createUserHandler} columns={columns(updateUserHandler, deleteUserHandler)} data={users} filteredColumn='username' />
            </MaxWidthWrapper>
        </>
    )
}