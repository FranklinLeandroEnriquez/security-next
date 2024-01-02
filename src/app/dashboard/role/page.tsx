'use client';

import { DataTable } from '@/components/data-table'
import { columns, Role } from '@/types/Role/columns'
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { UsersRound } from 'lucide-react';

import { deleteRole, getRoles } from "@/services/Role/RoleService";
import { RoleResponse } from "@/types/Role/RoleResponse";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { toast } from "sonner";

export default function Page() {
    const [roles, setRoles] = useState<RoleResponse[]>([] as RoleResponse[]);

    const router = useRouter();

    const deleteRoleHandler = async (id: number) => {
        await deleteRole(id).then((res) => {
            if (res.status === 200) {
                getRolesHandler();
                toast.success("Role deleted successfully");
            } else {
                toast.error('Error deleting role have dependencies');
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
            <Header title='All Roles' />
            <MaxWidthWrapper className='mt-4'>
                <DataTable<Role, string> onCreate={createRoleHandler} columns={columns(updateRoleHandler, deleteRoleHandler)} data={roles} filteredColumn='name' />
            </MaxWidthWrapper>
        </>
    )
}
