import { AuditRequest } from '@/types/Audit/AuditRequest';
const HOST = process.env.NEXT_PUBLIC_API_HOST;

export const getAudits = async (token: string) => {
    return await fetch(`${HOST}/api/audit`,
        {
            cache: 'no-store',
            headers: { authorization: `Bearer ${token}` }
        }
    );
}

export const getAudit = async (id: number, token: string) => {
    return await fetch(`${HOST}/api/audit/${id}`,
        {
            cache: 'no-store',
            headers: { authorization: `Bearer ${token}` }
        }
    );
}

export const getAuditByUser = async (id: number,  token: string,  skip: number, take: number) => {
    return await fetch(`${HOST}/api/audit/user/${id}?skip=${skip}&take=${take}`,
    {
        cache: 'no-store',
        headers: { authorization: `Bearer ${token}` }
    });
}

export async function logAuditAction(audit: AuditRequest, token: string) {
    const response = await fetch(`${HOST}/api/audit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(audit)
    });

    if (!response.ok) {
        throw new Error(`Failed to log audit action: ${response.statusText}`);
    }
}


export const getIpWithTimeout = async (timeoutMs: number) => {
    const ipifyPromise = fetch(`https://ipv4.seeip.org/jsonip`)
        .then(response => response.json())
        .then(data => data.ip)
        .catch(() => "0.0.0.0");

    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Timeout exceeded'));
        }, timeoutMs);
    });

    return Promise.race([ipifyPromise, timeoutPromise]);
}


export async function getIp() {
    const timeoutMs = 3000;
    return getIpWithTimeout(timeoutMs)
        .then(ip => {
            return ip;
        })
        .catch(() => {
            return "0.0.0.0"
        });
}
