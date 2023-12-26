import { CreateUserRequest } from "@/types/User/CreateUserRequest";
import { UpdateUserRequest } from "@/types/User/UpdateUserRequest";
import { UserResponse } from "@/types/User/UserResponse";
import { CrudResponse } from "@/types/shared/CrudResponse";

const HOST = 'http://localhost:3000';

export const getUsers = async (): Promise<UserResponse[]> => {
    return await fetch(`${HOST}/api/users`, { cache: 'no-store' }).then(res => res.json());
}

export const getUser = async (id: number) => {
    return await fetch(`${HOST}/api/users/${id}`, { cache: 'no-store' });
}

export const deleteUser = async (id: number) => {
    return await fetch(`${HOST}/api/users/${id}`, { method: 'DELETE' });
}

export const createUser = async (user: CreateUserRequest) => {
    return await fetch(`${HOST}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
}

export const updateUser = async (id: number, user: UpdateUserRequest) => {
    return await fetch(`${HOST}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
}