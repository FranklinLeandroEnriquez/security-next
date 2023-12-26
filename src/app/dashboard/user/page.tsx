import { UserRow } from "@/components/User/UserRow";
import { getUsers, deleteUser } from "@/services/User/UserService";
import { UserResponse } from "@/types/User/UserResponse";
import Link from 'next/link';


export default async function User() {

    const deleteUserHandler = async (id: number) => {
        await deleteUser(id).then(() => {
            console.log('deleted');
        });
    }

    const users: UserResponse[] = await getUsers();

    return (
        <div>
            <h1>User</h1>
            <Link href="/dashboard/user/create">
                <button>CREATE </button>
            </Link>

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
                        <UserRow user={user}></UserRow>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

