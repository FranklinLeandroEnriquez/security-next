import { CreateModuleRequest } from "@/types/Module/CreateModuleRequest";
import { UpdateModuleRequest } from "@/types/Module/UpdateModuleRequest";

const HOST = process.env.NEXT_PUBLIC_API_HOST;

export const getModules = async () => {
    return await fetch(`${HOST}/api/modules`, { cache: 'no-store' })
}

export const getModule = async (id: number) => {
    return await fetch(`${HOST}/api/modules/${id}`, { cache: 'no-store' });
}

export const deleteModule = async (id: number) => {
    return await fetch(`${HOST}/api/modules/${id}`, { method: 'DELETE' });
}

export const createModule = async (module: CreateModuleRequest) => {
    return await fetch(`${HOST}/api/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(module)
    });
}

export const updateModule = async (id: number, module: UpdateModuleRequest) => {
    return await fetch(`${HOST}/api/modules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(module)
    });
}