import React, { useCallback, useEffect } from 'react';
import { FunctionResponse } from '@/types/Function/FunctionResponse';
import { getFunction } from '@/services/Function/FunctionService';
import { useAuthToken } from '@/hooks/useAuthToken';
import { ErrorResponse } from '@/types/shared/ValidationError';
import { toast } from 'sonner';
import { ReporType } from '@/types/Reports/shared/Report';
import { renderData } from '@/types/Reports/shared/FormatData';
import {ReportHeader} from "@/types/Reports/shared/HeaderReport";

export function BasicFunctions<TData>({
    table,
}: ReporType<TData>) {

    const [functions, setFunctions] = React.useState<FunctionResponse[]>([]);

    const token = useAuthToken();

    const getIdSelectedItems = useCallback((): number[] => {
        const selectedIds = table?.getSelectedRowModel().flatRows.map((row) => {
            const id = (row.original as any).id;
            return id as number;
        });
        return selectedIds || [];
    }, [table]);

    const getFunctionHandler = useCallback(async (id: number): Promise<FunctionResponse> => {
        const res = await getFunction(id, token);
        if (res.status === 200) {
            const data: FunctionResponse = await res.json();
            return data;
        } else {
            const errorData: ErrorResponse = await res.json();
            toast.error(errorData.message.toString());
            throw new Error(errorData.message);
        }
    }, [token]);

    const getFunctionsHandler = useCallback(async (ids: number[]): Promise<FunctionResponse[]> => {
        const functions: FunctionResponse[] = [];

        for (const id of ids) {
            try {
                const function_ = await getFunctionHandler(id);
                functions.push(function_);
            } catch (error) {
                console.error(`Error obteniendo el usuario con ID ${id}: ${error}`);
            }
        }
        return functions;
    }, [getFunctionHandler]);

    const data = renderData(functions, 0, "Function");

    useEffect(() => {
        const ids = getIdSelectedItems();
        getFunctionsHandler(ids).then((functions) => {
            setFunctions(functions);
        });
    }, []);

    return(
        <ReportHeader data={data} dataType='Functions' />
    );
}
export default BasicFunctions;