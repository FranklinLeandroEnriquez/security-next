export interface AuditRequest {
    functionName: string;
    action: string;
    description: string;
    observation?: string;
    ip: string;
}