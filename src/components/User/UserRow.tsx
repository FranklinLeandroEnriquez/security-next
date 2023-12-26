'use client';

import { deleteUser } from "@/services/User/UserService";
import { UserResponse } from "@/types/User/UserResponse";
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

    const updateUserHandler = async (id: number) => {
        router.push(`/dashboard/user/update/${id}`);
    }

    return (
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
    );
}