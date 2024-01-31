import { CreateModuleRequest } from "@/types/Module/CreateModuleRequest";
import { UpdateModuleRequest } from "@/types/Module/UpdateModuleRequest";

const HOST = process.env.NEXT_PUBLIC_API_HOST;

export const getModules = async (token: string) => {
    return await fetch(`${HOST}/api/modules`,
        {
            cache: 'no-store',
            headers: { authorization: `Bearer ${token}` }
        }
    )
}

export const getModule = async (id: number, token: string) => {
    return await fetch(`${HOST}/api/modules/${id}`,
        {
            cache: 'no-store',
            headers: { authorization: `Bearer ${token}` }
        }
    );
}

export const getFunctionsForModule = async (id: number, token: string) => {
    return await fetch(`${HOST}/api/modules/${id}/functions`,
        {
            cache: 'no-store',
            headers: { authorization: `Bearer ${token}` }
        }
    );
}

export const deleteModule = async (id: number, token: string) => {
    return await fetch(`${HOST}/api/modules/${id}`,
        {
            method: 'DELETE',
            headers: { authorization: `Bearer ${token}` }
        }
    );
}

export const createModule = async (module: CreateModuleRequest, token: string) => {
    return await fetch(`${HOST}/api/modules`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify(module)
    });
}

export const updateModule = async (id: number, module: UpdateModuleRequest, token: string) => {
    return await fetch(`${HOST}/api/modules/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`
        },
        body: JSON.stringify(module)
    });
}