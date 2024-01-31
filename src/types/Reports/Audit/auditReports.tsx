import { Report } from '@/types/Reports/shared/Report';
import { Audit } from '@/types/Audit/columns';
import { allAudit } from '@/types/Reports/Audit/allAudit';
export const auditReports = (): Report<Audit>[] => {
    return [
        {
            title: 'All Audits',
            type: allAudit,
        },
    ]
}