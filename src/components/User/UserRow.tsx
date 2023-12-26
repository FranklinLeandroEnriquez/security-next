'use client';

import { deleteUser } from "@/services/User/UserService";
import { UserResponse } from "@/types/User/UserResponse";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export const UserRow = ({ user }: { user: UserResponse }) => {

    const router = useRouter();

    const deleteUserHandler = async (id: number) => {
        await deleteUser(id).then((res) => {
            if (res.status === 200) {
                return router.refresh();
            }
            window.alert('Error');
        }).catch((err) => {
            window.alert('Error');
        });

    }
    return (
        <tr key={user.id}>
            <td>
                <ul>
                    <li>
                        <Link href="/dashboard/user/update">
                            <button>UPDATE </button>
                        </Link>
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
    );
}