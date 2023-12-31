'use client';

import { DataTable } from '@/components/data-table'
import {columns, Module} from '@/types/Module/columns'
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { BookA } from 'lucide-react';

import { deleteModule, getModules } from "@/services/Module/ModuleService";
import { ModuleResponse } from "@/types/Module/ModuleResponse";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

export default function Page() {
    const [modules, setModules] = useState<ModuleResponse[]>([] as ModuleResponse[]);
    
    const router = useRouter();

    const deleteModuleHandler = async (id: number) => {
        await deleteModule(id).then((res) => {
            if (res.status === 200) {
                return getModulesHandler();
            }
            window.alert('Error');
        }).catch((err) => {
            window.alert('Error');
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
            <Header title="Modules" IconComponent={BookA} />
            <MaxWidthWrapper>
                <div className="relative top-8 left-[83%] sm:left-[89.5%] z-10">
                    <Button onClick={createModuleHandler}>
                        Create module
                    </Button>
                </div>
                <DataTable<Module,string>
                    columns={columns(updateModuleHandler, deleteModuleHandler)}
                    data={modules}
                />
            </MaxWidthWrapper>
        </>
    )
}