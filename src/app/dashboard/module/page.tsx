'use client';

import { DataTable } from '@/components/data-table'
import { useColumns, Module } from '@/types/Module/columns'
import MaxWidthWrapper from "@/components/MaxWidthWrapper"

import { deleteModule, getModules } from "@/services/Module/ModuleService";
import { ModuleResponse } from "@/types/Module/ModuleResponse";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import Header from '@/components/Header';
import { toast } from "sonner";
import { FileBarChart2 } from "lucide-react";
import { getIp, logAuditAction } from '@/services/Audit/AuditService';
import { useAuthToken } from '@/hooks/useAuthToken';
import { useSessionAuth } from '@/hooks/useSessionAuth';
import { useUserFunctions } from '@/contexts/UserFunctionProvider';
import validFunctions from '@/providers/ValidateFunctions';

function Page() {
    const [modules, setModules] = useState<ModuleResponse[]>([] as ModuleResponse[]);

    const router = useRouter();
    const token = useAuthToken();
    const userFunctions = useUserFunctions();
    const isFunctionCreate = userFunctions?.includes('SEC-MODULES-CREATE') || false;

    const deleteModuleHandler = async (id: number) => {
        const ip = await getIp();
        await deleteModule(id, token).then(async (res) => {
            if (res.status === 200) {
                await logAuditAction({
                    functionName: 'SEC-MODULES-DELETE',
                    action: 'delete Module',
                    description: 'Successfully deleted module',
                    observation: `Module id: ${id}`,
                    ip: ip.toString(),
                }, token);
                getModulesHandler();
                toast.success("Module deleted successfully");

            } else {
                await logAuditAction({
                    functionName: 'SEC-MODULES-DELETE',
                    action: 'delete Module',
                    description: 'Failed to delete Module',
                    ip: ip.toString(),
                }, token);

                toast.error('Error deleting module have functions');
            }
        }).catch((err) => {
            toast.error('Error deleting module');
        });
    }

    const updateModuleHandler = async (id: number) => {
        router.push(`/dashboard/module/update/${id}`);
    }

    const createModuleHandler = async () => {
        router.push(`/dashboard/module/create`);
    }

    const getModulesHandler = async () => {
        const ip = await getIp();
        await getModules(token).then(async (res) => {
            if (res.status === 200) {
                await logAuditAction({
                    functionName: 'SEC-MODULES-READ',
                    action: 'get Modules',
                    description: 'Successfully fetched modules',
                    ip: ip.toString(),

                }, token);
                return res.json().then((data) => {
                    setModules(data);
                });

            } else {
                await logAuditAction({
                    functionName: 'SEC-MODULES-READ',
                    action: 'get Modules',
                    description: 'Failed to fetch modules',
                    ip: ip.toString(),
                }, token);

                toast.error('An error has occurred');
            }
        }).catch((err) => {
            toast.error('An error has occurred');
        });
    }

    useEffect(() => {
        getModulesHandler();
    }, []);

    return (
        <>
            <Header title='All Modules' icon={<FileBarChart2 size={25} />} />
            <MaxWidthWrapper className='mt-4'>
                <DataTable<Module, string>
                    canCreate={isFunctionCreate}
                    onCreate={createModuleHandler}
                    columns={useColumns(updateModuleHandler, deleteModuleHandler)}
                    data={modules}
                    moduleName='Modules'
                    description='Modules of the system'
                />
            </MaxWidthWrapper>
        </>
    )
}
export default validFunctions(Page, 'SEC-MODULES-READ');