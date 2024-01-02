'use client';

import { DataTable } from '@/components/data-table'
import { columns, Function } from '@/types/Function/columns'
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { FunctionSquare } from 'lucide-react';

import { deleteFunction, getFunctions } from "@/services/Function/FunctionService";
import { FunctionResponse } from "@/types/Function/FunctionResponse";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
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
            <Header title='All Functions' />
            <MaxWidthWrapper className='mt-4'>
                <DataTable<Function, string>
                    onCreate={createFunctionHandler}
                    columns={columns(updateFunctionHandler, deleteFunctionHandler)}
                    data={functions}
                    filteredColumn='name'
                />
            </MaxWidthWrapper>
        </>
    )
}