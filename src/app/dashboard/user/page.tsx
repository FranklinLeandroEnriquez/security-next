'use client';

import { DataTable } from '@/components/data-table'
import { columns, User } from '@/app/dashboard/user/columns'
import MaxWidthWrapper from "@/components/MaxWidthWrapper"

import { deleteUser } from "@/services/User/UserService";
import { UserResponse } from "@/types/User/UserResponse";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function Page() {
    const [users, setUsers] = useState<UserResponse[]>([] as UserResponse[]);

    const router = useRouter();

    const deleteUserHandler = async (id: number) => {
        await deleteUser(id).then((res) => {
            if (res.status === 200) {
                return getUsersLocal();
            }
            window.alert('Error');
        }).catch((err) => {
            window.alert('Error');
        });
    }

    const updateUserHandler = async (id: number) => {
        router.push(`/dashboard/user/update/${id}`);
    }

    const createUserHandler = async () => {
        router.push(`/dashboard/user/create`);
    }

    const getUsersLocal = async () => {
        const res = await fetch('http://localhost:3000/api/users');
        const data: UserResponse[] = await res.json();
        setUsers(data);
    }

    useEffect(() => {
        getUsersLocal();
    }, []);

    return (
        <MaxWidthWrapper>
            <h1> ALL USERS</h1>
            <DataTable<User, string> columns={columns(updateUserHandler, deleteUserHandler)} data={users} />
        </MaxWidthWrapper>
    )
}