import { CreateUserRequest } from "@/types/User/CreateUserRequest";
import { UpdateUserRequest } from "@/types/User/UpdateUserRequest";
import { AssignRolesToUserRequest } from "@/types/User/AssingRolesToUserRequest";

const HOST = process.env.NEXT_PUBLIC_API_HOST;

export const getUsers = async () => {
    return await fetch(`${HOST}/api/users`, { cache: 'no-store' })
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

export const getRolesOfUser = async (id: number) => {
    return await fetch(`${HOST}/api/users/${id}/roles`, { method: 'GET' });
}

export const assignRoles = async (id: number, roles: AssignRolesToUserRequest) => {
    return await fetch(`${HOST}/api/users/${id}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roles)
    });
}