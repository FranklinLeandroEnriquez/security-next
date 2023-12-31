import { CreateFunctionRequest } from "@/types/Function/CreateFunctionRequest";
import { UpdateFunctionRequest } from "@/types/Function/UpdateFunctionRequest";

const HOST = process.env.NEXT_PUBLIC_API_HOST;

export const getFunctions = async () => {
    return await fetch(`${HOST}/api/functions`, { cache: 'no-store' })
}

export const getFunction = async (id: number) => {
    return await fetch(`${HOST}/api/functions/${id}`, { cache: 'no-store' });
}

export const deleteFunction = async (id: number) => {
    return await fetch(`${HOST}/api/functions/${id}`, { method: 'DELETE' });
}

export const createFunction = async (func: CreateFunctionRequest) => {
    return await fetch(`${HOST}/api/functions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(func)
    });
}

export const updateFunction = async (id: number, func: UpdateFunctionRequest) => {
    return await fetch(`${HOST}/api/functions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(func)
    });
}