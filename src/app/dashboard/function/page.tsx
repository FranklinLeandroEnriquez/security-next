'use client';

import { DataTable } from '@/components/data-table'
import {columns, Function} from '@/types/Function/columns'
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import {FunctionSquare} from 'lucide-react';

import { deleteFunction, getFunctions } from "@/services/Function/FunctionService";
import { FunctionResponse } from "@/types/Function/FunctionResponse";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

export default function Page() {
    const [functions, setFunctions] = useState<FunctionResponse[]>([] as FunctionResponse[]);
    
    const router = useRouter();

    const deleteFunctionHandler = async (id: number) => {
        await deleteFunction(id).then((res) => {
            if (res.status === 200) {
                return getFunctionsHandler();
            }
            window.alert('Error');
        }).catch((err) => {
            window.alert('Error');
        });
    }

    const updateFunctionHandler = async (id: number) => {
        router.push(`/dashboard/function/update/${id}`);
    }

    const createFunctionHandler = async () => {
        router.push(`/dashboard/function/create`);
    }

    const getFunctionsHandler = async () => {
        await getFunctions().then((res) => {
            if (res.status === 200) {
                return res.json().then((data) => {
                    setFunctions(data);
                });
            }
            window.alert('Error');
        }).catch((err) => {
            window.alert('Error');
        });
    }

    useEffect(() => {
        getFunctionsHandler();
    }, []);

    return (
        <>
            <Header title="Functions" IconComponent={FunctionSquare} />
            <MaxWidthWrapper>
                <div className="relative top-8 left-[83%] sm:left-[89.5%] z-10">
                    <Button onClick={createFunctionHandler}>Create</Button>
                </div>
                <DataTable<Function,string>
                    columns={columns(updateFunctionHandler, deleteFunctionHandler)}
                    data={functions}
                />
            </MaxWidthWrapper>
        </>
    )
}