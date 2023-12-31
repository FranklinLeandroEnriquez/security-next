'use client';

import { DataTable } from '@/components/data-table'
import { columns, User } from '@/types/User/columns'
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { UsersRound } from 'lucide-react';

import { deleteUser, getUsers } from "@/services/User/UserService";
import { UserResponse } from "@/types/User/UserResponse";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

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
        getUsers().then(async (res) => {
            if (res.status === 200) {
                return res.json().then((data) => {
                    setUsers(data);
                });
            }
        }).catch((err) => {
            return window.alert('Error');
        });
    }

    useEffect(() => {
        getUsersLocal();
    }, []);

    return (
        <>
            <Header title="Usuarios" IconComponent={UsersRound} />
            <MaxWidthWrapper>
                <div className="relative top-8 left-[83%] sm:left-[89.5%] z-10">
                    <Button onClick={createUserHandler}>
                        <span> Crear Usuario</span>
                    </Button>
                </div>
                <DataTable<User, string> columns={columns(updateUserHandler, deleteUserHandler)} data={users} />
            </MaxWidthWrapper>
        </>
    )
}