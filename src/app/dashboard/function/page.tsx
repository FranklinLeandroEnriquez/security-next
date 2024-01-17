'use client';

import { DataTable } from '@/components/Table/data-table'
import { useColumns, Function } from '@/types/Function/columns'
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
import { useUserFunctions } from '@/contexts/UserFunctionProvider';
import ValidFunctions from '@/providers/ValidateFunctions';
import exp from 'constants';

function Page() {
    const [functions, setFunctions] = useState<FunctionResponse[]>([] as FunctionResponse[]);
    const [errors, setErrors] = useState<ErrorResponse | null>(null);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);
    const [reportData, setReportData] = useState<any[]>([] as any[]);
    const router = useRouter();
    const token = useAuthToken();

    const userFunctions = useUserFunctions();
    const isFunctionCreate = userFunctions?.includes('SEC-FUNCTIONS-CREATE') || false;

    const deleteFunctionHandler = async (id: number) => {
        const ip = await getIp();
        await deleteFunction(id, token).then(async (res) => {
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
        await getFunctions(token).then(async (res) => {
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
    const groupByFunctionWithIds = async (ids: number[]) => {
        await getFunctionsHandler();
        const filteredFunctions = functions.filter(func => ids.includes(func.id));
        return filteredFunctions.map(func => ({
            id: func.id,
            name: func.name,
            module: func.module.name,
        }));
    };

    const handleGenerateReport = async (ids: number[]) => {
        const functionDataWithIds = await groupByFunctionWithIds(ids);
        const report = functionDataWithIds.map((functionData) => {
            return {
                functionId: functionData.id,
                functionName: functionData.name,
                moduleName: functionData.module,
            };
        });
        setReportData(report);
    }

    useEffect(() => {
        getFunctionsHandler();
    }, []);

    return (
        <>
            <Header title='All Functions' icon={<FunctionSquare size={25} />} />
            <MaxWidthWrapper>
                <DataTable<Function, string>
                    canCreate={isFunctionCreate}
                    onCreate={createFunctionHandler}
                    columns={useColumns(updateFunctionHandler, deleteFunctionHandler)}
                    data={functions}
                    moduleName='Functions'
                    description='Functions of the system'
                // onGenerateReport={handleGenerateReport}
                // reportData={reportData}
                />
            </MaxWidthWrapper>
        </>
    )
};

export default ValidFunctions(Page, 'SEC-FUNCTIONS-READ');