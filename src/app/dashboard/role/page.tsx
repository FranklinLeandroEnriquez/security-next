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
import { useSessionAuth } from '@/hooks/useSessionAuth';

export default function Page() {
    const [roles, setRoles] = useState<RoleResponse[]>([] as RoleResponse[]);
    const [errors, setErrors] = useState<ErrorResponse | null>(null);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);
    const router = useRouter();

    const [isFunctionCreate, setIsFunctionCreate] = useState<boolean>(false);

    //Control de sesion de usuario
    const { getAuthResponse } = useSessionAuth();
    const authResponse = getAuthResponse();

    useEffect(() => {
        const hasFunctionCreate = authResponse?.functions.includes('SEC-ROLES-CREATE') || false;
        setIsFunctionCreate(hasFunctionCreate);
    }, []);

    const deleteRoleHandler = async (id: number) => {
        await deleteRole(id).then(async (res) => {
            if (res.status === 200) {
                getRolesHandler();
                toast.success("Role deleted successfully");
            } else {
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
        await getRoles().then((res) => {
            if (res.status === 200) {
                return res.json().then((data) => {
                    setRoles(data);
                });
            }
            toast.error('An error has occurred');
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
                <DataTable<Role, string>
                    isFunctionCreate={isFunctionCreate}
                    onCreate={createRoleHandler}
                    columns={columns(updateRoleHandler, deleteRoleHandler)}
                    data={roles}
                    filteredColumn='name' />
            </MaxWidthWrapper>
        </>
    )
}
