'use client';

import { DataTable } from '@/components/data-table'
import { columns, Module } from '@/types/Module/columns'
import MaxWidthWrapper from "@/components/MaxWidthWrapper"

import { deleteModule, getModules } from "@/services/Module/ModuleService";
import { ModuleResponse } from "@/types/Module/ModuleResponse";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import Header from '@/components/Header';
import { toast } from "sonner";
import { FileBarChart2 } from "lucide-react";
import { useSessionAuth } from '@/hooks/useSessionAuth';

export default function Page() {
    const [modules, setModules] = useState<ModuleResponse[]>([] as ModuleResponse[]);

    const router = useRouter();

    const [isFunctionCreate, setIsFunctionCreate] = useState<boolean>(false);

    //Control de sesion de usuario
    const { getAuthResponse } = useSessionAuth();
    const authResponse = getAuthResponse();

    useEffect(() => {
        const hasFunctionCreate = authResponse?.functions.includes('SEC-MODULES-CREATE') || false;
        setIsFunctionCreate(hasFunctionCreate);
    }, []);

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
                    isFunctionCreate={isFunctionCreate}
                    onCreate={createModuleHandler}
                    columns={columns(updateModuleHandler, deleteModuleHandler)}
                    data={modules}
                    filteredColumn='name'
                />
            </MaxWidthWrapper>
        </>
    )
}