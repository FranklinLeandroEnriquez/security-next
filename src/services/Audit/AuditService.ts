import { AuditRequest } from '@/types/Audit/AuditRequest';
const HOST = process.env.NEXT_PUBLIC_API_HOST;

export const getAudits = async () => {
    return await fetch(`${HOST}/api/audit`, { cache: 'no-store' })
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
export const getIp = async () => {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
}