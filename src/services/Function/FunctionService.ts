import { CreateFunctionRequest } from "@/types/Function/CreateFunctionRequest";
import { UpdateFunctionRequest } from "@/types/Function/UpdateFunctionRequest";

const HOST = process.env.NEXT_PUBLIC_API_HOST;

export const getFunctions = async (token: string) => {
    return await fetch(`${HOST}/api/functions`,
        {
            cache: 'no-store',
            headers: { authorization: `Bearer ${token}` }
        }
    );
}

export const getFunction = async (id: number, token: string) => {
    return await fetch(`${HOST}/api/functions/${id}`,
        {
            cache: 'no-store',
            headers: { authorization: `Bearer ${token}` }
        }
    );
}

export const deleteFunction = async (id: number, token: string) => {
    return await fetch(`${HOST}/api/functions/${id}`,
        {
            method: 'DELETE',
            headers: { authorization: `Bearer ${token}` }
        }
    );
}

export const createFunction = async (func: CreateFunctionRequest, token: string) => {
    return await fetch(`${HOST}/api/functions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify(func)
    });
}

export const updateFunction = async (id: number, func: UpdateFunctionRequest, token: string) => {
    return await fetch(`${HOST}/api/functions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify(func)
    });
}