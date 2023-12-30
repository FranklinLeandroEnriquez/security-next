'use client';

import { deleteUser, getUsers, createUser } from "@/services/User/UserService";
import { UserResponse } from "@/types/User/UserResponse";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


export default function User() {
    const [users, setUsers] = useState<UserResponse[]>([] as UserResponse[]);

    const router = useRouter();

    const deleteUserHandler = async (id: number) => {
        await deleteUser(id).then((res) => {
            if (res.status === 200) {
                return getUsersHandler();
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

    const getUsersHandler = async () => {
        await getUsers().then((res) => {
            if (res.status === 200) {
                return res.json().then((data) => {
                    setUsers(data);
                });
            }
            window.alert('Error');
        }).catch((err) => {
            window.alert('Error');
        });
    }

    useEffect(() => {
        getUsersHandler();
    }, [users.length]);

    return (
        <div>
            <h1>User</h1>
            <button onClick={createUserHandler}>CREATE </button>

            <Table>
                <TableCaption>List of Users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>NAME</TableHead>
                        <TableHead>EMAIL</TableHead>
                        <TableHead>DNI</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user: UserResponse) => (
                        <TableRow key={user.id}>

                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.dni}</TableCell>
                            <TableCell>{user.status ? 'True' : 'False'}</TableCell>
                            <TableCell>
                                <ul>
                                    <li>
                                        <button onClick={(e) => updateUserHandler(user.id)}>UPDATE </button>
                                    </li>
                                    <li>
                                        <button onClick={(e) => deleteUserHandler(user.id)}>DELETE </button>
                                    </li>
                                </ul>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

