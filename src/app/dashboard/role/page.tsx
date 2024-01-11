'use client';

import { DataTable } from '@/components/data-table'
import { columns, Role } from '@/types/Role/columns'
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { ErrorResponse } from '@/types/shared/ValidationError';
import { deleteRole, getRoles } from "@/services/Role/RoleService";
import { RoleResponse } from "@/types/Role/RoleResponse";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { UserCheck } from 'lucide-react';
import Header from '@/components/Header';
import { toast } from "sonner";
import { getIp,logAuditAction } from '@/services/Audit/AuditService';
import { useAuthToken } from '@/hooks/useAuthToken';

export default function Page() {
    const [roles, setRoles] = useState<RoleResponse[]>([] as RoleResponse[]);
    const [errors, setErrors] = useState<ErrorResponse | null>(null);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);
    const router = useRouter();
    const token = useAuthToken();

    const deleteRoleHandler = async (id: number) => {
        const ip = await getIp();
        await deleteRole(id).then(async (res) => {
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
                if (errorData.error === 'ErrorResponse') {
                    setErrorResponse(null);
                    setErrors(errorData);
                    toast.error(errorData.message.toString());
                }
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
        await getRoles().then(async (res) => {
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

                toast.error('An error has occurred');
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
            <MaxWidthWrapper className='mt-4'>
                <DataTable<Role, string> onCreate={createRoleHandler} columns={columns(updateRoleHandler, deleteRoleHandler)} data={roles} filteredColumn='name' />
            </MaxWidthWrapper>
        </>
    )
}
