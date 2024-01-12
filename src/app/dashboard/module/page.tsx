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
import { useSessionAuth } from '@/hooks/useSessionAuth';
import { useUserFunctions } from '@/contexts/UserFunctionProvider';
import validFunctions from '@/providers/ValidateFunctions';

function Page() {
    const [modules, setModules] = useState<ModuleResponse[]>([] as ModuleResponse[]);

    const router = useRouter();
    const userFunctions = useUserFunctions();
    const isFunctionCreate = userFunctions?.includes('SEC-MODULES-CREATE') || false;

    const deleteModuleHandler = async (id: number) => {
        await deleteModule(id).then((res) => {
            if (res.status === 200) {
                getModulesHandler();
                toast.success("Module deleted successfully");
            } else {
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
        await getModules().then((res) => {
            if (res.status === 200) {
                return res.json().then((data) => {
                    setModules(data);
                });
            }
            window.alert('Error');
        }).catch((err) => {
            window.alert('Error');
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
                    filteredColumn='name'
                />
            </MaxWidthWrapper>
        </>
    )
}
export default validFunctions(Page, 'SEC-MODULES-READ');