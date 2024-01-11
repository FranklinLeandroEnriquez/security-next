'use client';

import { DataTable } from '@/components/data-table'
import { columns, Function } from '@/types/Function/columns'
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { ErrorResponse } from "@/types/shared/ValidationError"
import { deleteFunction, getFunctions } from "@/services/Function/FunctionService";
import { FunctionResponse } from "@/types/Function/FunctionResponse";
import { useRouter } from 'next/navigation';
import { useEffect, useState, useContext } from "react";
import Header from '@/components/Header';
import { toast } from 'sonner';
import { FunctionSquare } from 'lucide-react';
import { getIp, logAuditAction } from '@/services/Audit/AuditService';
import { useAuthToken } from '@/hooks/useAuthToken';

export default function Page() {
    const [functions, setFunctions] = useState<FunctionResponse[]>([] as FunctionResponse[]);
    const [errors, setErrors] = useState<ErrorResponse | null>(null);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);
    const router = useRouter();
    const token = useAuthToken();

    const deleteFunctionHandler = async (id: number) => {
        const ip = await getIp();
        await deleteFunction(id).then(async (res) => {
            if (res.status === 200) {
                await logAuditAction({
                    functionName: 'SEC-FUNCTIONS-DELETE',
                    action: 'delete Function',
                    description: 'Successfully deleted function',
                    observation: `Function id: ${id}`,
                    ip: ip.toString(),
                }, token);

                return getFunctionsHandler();
            } else {
                await logAuditAction({
                    functionName: 'SEC-FUNCTIONS-DELETE',
                    action: 'delete Function',
                    description: 'Failed to delete function',
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
            toast.error('An error has occurred');
        });
    }

    const updateFunctionHandler = async (id: number) => {
        router.push(`/dashboard/function/update/${id}`);
    }

    const createFunctionHandler = async () => {
        router.push(`/dashboard/function/create`);
    }

    const getFunctionsHandler = async () => {
        const ip = await getIp();
        await getFunctions().then(async (res) => {
            if (res.status === 200) {
                await logAuditAction({
                    functionName: 'SEC-FUNCTIONS-READ',
                    action: 'get Functions',
                    description: 'Successfully fetched functions',
                    ip: ip.toString(),

                }, token);
                return res.json().then((data) => {
                    setFunctions(data);
                });
            } else {
                await logAuditAction({
                    functionName: 'SEC-FUNCTIONS-READ',
                    action: 'get Functions',
                    description: 'Failed to fetch functions',
                    ip: ip.toString(),
                }, token);
                toast.error('An error has occurred');

            }
        }).catch((err) => {
            toast.error('An error has occurred');
        });
    }

    useEffect(() => {
        getFunctionsHandler();
    }, []);

    return (
        <>
            <Header title='All Functions' icon={<FunctionSquare size={25} />} />
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