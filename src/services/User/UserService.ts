import { UserResponse } from "@/types/User/UserResponse";
import { CrudResponse } from "@/types/shared/CrudResponse";

const HOST = 'http://localhost:3000';

export const getUsers = async (): Promise<UserResponse[]> => {
    return await fetch(`${HOST}/api/users`, { cache: 'no-store' }).then(res => res.json());
}

export const deleteUser = async (id: number) => {
    return await fetch(`${HOST}/api/users/${id}`, { method: 'DELETE' });
}