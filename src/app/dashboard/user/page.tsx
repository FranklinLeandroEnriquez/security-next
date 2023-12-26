'use client';

import { deleteUser, getUsers } from "@/services/User/UserService";
import { UserResponse } from "@/types/User/UserResponse";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";


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

            <table>
                <thead>
                    <tr>
                        <th>Actions</th>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>DNI</th>
                        <th>STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user: UserResponse) => (
                        <tr key={user.id}>
                            <td>
                                <ul>
                                    <li>
                                        <button onClick={(e) => updateUserHandler(user.id)}>UPDATE </button>
                                    </li>
                                    <li>
                                        <button onClick={(e) => deleteUserHandler(user.id)}>DELETE </button>
                                    </li>
                                </ul>
                            </td>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.dni}</td>
                            <td>{user.status ? 'True' : 'Flase'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

