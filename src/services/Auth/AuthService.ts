import { LoginRequest } from "@/types/Auth/LoginRequest";

const HOST = process.env.NEXT_PUBLIC_API_HOST;

export const authenticate = async (request: LoginRequest) => {
    return await fetch(`${HOST}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
    });
}


export const verifyToken = async (token: string) => {
    return await fetch(`${HOST}/api/auth`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
}

export const getFunctionsUser = async (token: string) => {
    return await fetch(`${HOST}/api/auth/functions`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
}

