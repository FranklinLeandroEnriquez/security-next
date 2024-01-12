import { CreateRoleRequest } from "@/types/Role/CreateRoleRequest";
import { UpdateRoleRequest } from "@/types/Role/UpdateRoleRequest";
import { AssignFunctionsToRoleRequest } from "@/types/Role/AssignFunctionsToRoleRequest";

const HOST = process.env.NEXT_PUBLIC_API_HOST;

export const getRoles = async (token: string) => {
    return await fetch(`${HOST}/api/roles`,
        {
            cache: 'no-store',
            headers: { authorization: `Bearer ${token}` }
        }
    )
}

export const getRole = async (id: number, token: string) => {
    return await fetch(`${HOST}/api/roles/${id}`,
        {
            cache: 'no-store',
            headers: { authorization: `Bearer ${token}` }
        });
}

export const deleteRole = async (id: number, token: string) => {
    return await fetch(`${HOST}/api/roles/${id}`,
        {
            method: 'DELETE',
            headers: { authorization: `Bearer ${token}` }
        }
    );
}

export const createRole = async (role: CreateRoleRequest, token: string) => {
    return await fetch(`${HOST}/api/roles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify(role)
    });
}

export const updateRole = async (id: number, role: UpdateRoleRequest, token: string) => {
    return await fetch(`${HOST}/api/roles/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify(role)
    });
}

export const getFunctionsOfRole = async (id: number, token: string) => {
    return await fetch(`${HOST}/api/roles/${id}/functions`,
        {
            method: 'GET',
            headers: { authorization: `Bearer ${token}` }
        }
    );
}

export const assignFunctions = async (id: number, functions: AssignFunctionsToRoleRequest, token: string) => {
    return await fetch(`${HOST}/api/roles/${id}/functions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify(functions)
    });
}