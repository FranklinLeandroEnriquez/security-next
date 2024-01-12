import { CreateUserRequest } from "@/types/User/CreateUserRequest";
import { UpdateUserRequest } from "@/types/User/UpdateUserRequest";
import { AssignRolesToUserRequest } from "@/types/User/AssingRolesToUserRequest";

const HOST = process.env.NEXT_PUBLIC_API_HOST;

export const getUsers = async (token: string) => {
    return await fetch(`${HOST}/api/users`,
        {
            cache: 'no-store',
            headers: { authorization: `Bearer ${token}` }
        }
    )
}

export const getUser = async (id: number, token: string) => {
    return await fetch(`${HOST}/api/users/${id}`,
        {
            cache: 'no-store',
            headers: { authorization: `Bearer ${token}` }
        }
    );
}

export const deleteUser = async (id: number, token: string) => {
    return await fetch(`${HOST}/api/users/${id}`,
        {
            method: 'DELETE',
            headers: { authorization: `Bearer ${token}` }
        }
    );
}

export const createUser = async (user: CreateUserRequest, token: string) => {
    return await fetch(`${HOST}/api/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify(user)
    });
}

export const updateUser = async (id: number, user: UpdateUserRequest, token: string) => {
    return await fetch(`${HOST}/api/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify(user)
    });
}

export const getRolesOfUser = async (id: number, token: string) => {
    return await fetch(`${HOST}/api/users/${id}/roles`,
        {
            method: 'GET',
            headers: { authorization: `Bearer ${token}` }
        }
    );
}

export const assignRoles = async (id: number, roles: AssignRolesToUserRequest, token: string) => {
    return await fetch(`${HOST}/api/users/${id}/roles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify(roles)
    });
}