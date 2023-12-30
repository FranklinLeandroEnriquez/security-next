export interface AuditResponse {
    id: number;
    action: string;
    description: string;
    observation: string;
    ip: string;
    date: Date;
    user: string;
    functionName?: string;
}