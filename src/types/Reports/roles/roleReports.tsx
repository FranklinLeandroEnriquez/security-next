import { Report } from '@/types/Reports/shared/Report';
import basicRoles from "@/types/Reports/roles/allRoles"
import { Role } from "@/types/Role/columns"
import RolesModulesFunctionsReport from './RolesModulesFunctionsReport/RolesModulesFunctionsReport';
import { RelationalRoles } from './relationalRoles';

export const roleReports = (): Report<Role>[] => {
    return [
        {
            title: 'Basic Roles',
            type: basicRoles
        },
        {
            title: 'Complete Report',
            type: RolesModulesFunctionsReport
        },
        {
            title: 'Relational Roles',
            type: RelationalRoles
        }
    ]
}