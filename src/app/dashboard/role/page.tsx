'use client';

import { DataTable } from '@/components/Table/data-table'
import { useColumns, Role } from '@/types/Role/columns'
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { ErrorResponse } from '@/types/shared/ValidationError';
import { deleteRole, getRoles } from "@/services/Role/RoleService";
import { RoleResponse } from "@/types/Role/RoleResponse";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { UserCheck } from 'lucide-react';
import Header from '@/components/Header';
import { toast } from "sonner";
import { getIp, logAuditAction } from '@/services/Audit/AuditService';
import { useAuthToken } from '@/hooks/useAuthToken';
import { useSessionAuth } from '@/hooks/useSessionAuth';
import { useUserFunctions } from '@/contexts/UserFunctionProvider';
import validFunctions from '@/providers/ValidateFunctions';

function Page() {
    const [roles, setRoles] = useState<RoleResponse[]>([] as RoleResponse[]);
    const router = useRouter();
    const token = useAuthToken();

    const userFunctions = useUserFunctions();
    const isFunctionCreate = userFunctions?.includes('SEC-ROLES-CREATE') || false;



    const deleteRoleHandler = async (id: number) => {
        const ip = await getIp();
        await deleteRole(id, token).then(async (res) => {
            if (res.status === 200) {

                await logAuditAction({
                    functionName: 'SEC-ROLES-DELETE',
                    action: 'delete Role',
                    description: 'Successfully deleted role',
                    observation: `Role id: ${id}`,
                    ip: ip.toString(),
                }, token);
                getRolesHandler();
                toast.success("Role deleted successfully");

            } else {
                await logAuditAction({
                    functionName: 'SEC-ROLES-DELETE',
                    action: 'delete Role',
                    description: 'Failed to delete role',
                    ip: ip.toString(),
                }, token);
                const errorData: ErrorResponse = await res.json();
                toast.error(errorData.message.toString());
            }
        }).catch((err) => {
            toast.error('Error deleting role');
        });
    }

    const updateRoleHandler = async (id: number) => {
        router.push(`/dashboard/role/update/${id}`);
    }

    const createRoleHandler = async () => {
        router.push(`/dashboard/role/create`);
    }

    const getRolesHandler = async () => {
        const ip = await getIp();
        await getRoles(token).then(async (res) => {
            if (res.status === 200) {
                await logAuditAction({
                    functionName: 'SEC-ROLES-READ',
                    action: 'get Roles',
                    description: 'Successfully fetched roles',
                    ip: ip.toString(),

                }, token);
                return res.json().then((data) => {
                    setRoles(data);
                });
            } else {
                await logAuditAction({
                    functionName: 'SEC-ROLES-READ',
                    action: 'get Roles',
                    description: 'Failed to fetch roles',
                    ip: ip.toString(),
                }, token);

                const errorData: ErrorResponse = await res.json();
                toast.error(errorData.message.toString());
            }
        }).catch((err) => {
            toast.error('An error has occurred');
        });
    }

    useEffect(() => {
        getRolesHandler();
    }, []);

    return (
        <>
            <Header title='All Roles' icon={<UserCheck />} />
            <MaxWidthWrapper className='my-5'>
                <DataTable<Role, string>
                    canCreate={isFunctionCreate}
                    onCreate={createRoleHandler}
                    columns={useColumns(updateRoleHandler, deleteRoleHandler)}
                    data={roles}
                    moduleName='Roles'
                    description='Roles of the system'
                />
            </MaxWidthWrapper>
        </>
    )
}

export default validFunctions(Page, 'SEC-ROLES-READ');