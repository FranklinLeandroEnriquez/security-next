'use client';

import { DataTable } from '@/components/data-table'
import { useColumns, Function } from '@/types/Function/columns'
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { ErrorResponse } from "@/types/shared/ValidationError"
import { deleteFunction, getFunctions } from "@/services/Function/FunctionService";
import { FunctionResponse } from "@/types/Function/FunctionResponse";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import Header from '@/components/Header';
import { toast } from 'sonner';
import { FunctionSquare } from 'lucide-react';
import { useUserFunctions } from '@/contexts/UserFunctionProvider';
import ValidFunctions from '@/providers/ValidateFunctions';
import exp from 'constants';

function Page() {
    const [functions, setFunctions] = useState<FunctionResponse[]>([] as FunctionResponse[]);
    const [errors, setErrors] = useState<ErrorResponse | null>(null);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);
    const router = useRouter();

    const userFunctions = useUserFunctions();
    const isFunctionCreate = userFunctions?.includes('SEC-FUNCTIONS-CREATE') || false;

    const deleteFunctionHandler = async (id: number) => {
        await deleteFunction(id).then(async (res) => {
            if (res.status === 200) {
                return getFunctionsHandler();
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
        await getFunctions().then((res) => {
            if (res.status === 200) {
                return res.json().then((data) => {
                    setFunctions(data);
                });
            }
            toast.error('An error has occurred');
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
                    canCreate={isFunctionCreate}
                    onCreate={createFunctionHandler}
                    columns={useColumns(updateFunctionHandler, deleteFunctionHandler)}
                    data={functions}
                    filteredColumn='name'
                />
            </MaxWidthWrapper>
        </>
    )
};

export default ValidFunctions(Page, 'SEC-FUNCTIONS-READ');