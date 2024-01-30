import React, { useCallback, useEffect } from 'react';
import { ModuleResponse } from '@/types/Module/ModuleResponse';
import { getModule, getFunctionsForModule } from '@/services/Module/ModuleService';
import { useAuthToken } from '@/hooks/useAuthToken';
import { ErrorResponse } from '@/types/shared/ValidationError';
import { toast } from 'sonner';
import { ReporType } from '@/types/Reports/shared/Report';
import { renderData } from '@/types/Reports/shared/FormatData';
import { ReportHeader } from "@/types/Reports/shared/HeaderReport";
import { FunctionResponse } from '../functions/allFunctions';
import { getFunction } from '@/services/Function/FunctionService';

export function relationalModules<TData>({
    table,
}: ReporType<TData>) {
    const [modules, setModules] = React.useState<ModuleResponse[]>([]);
    const token = useAuthToken();

    const getIdSelectedItems = useCallback((): number[] => {
        const selectedIds = table?.getSelectedRowModel().flatRows.map((row) => {
            const id = (row.original as any).id;
            return id as number;
        });
        return selectedIds || [];
    }, [table]);

    const getModuleHandler = useCallback(async (id: number): Promise<ModuleResponse & { functions: FunctionResponse[] }> => {
        const res = await getModule(id, token);
        if (res.status === 200) {
            const data: ModuleResponse = await res.json();
            const functionsRes = await getFunctionsForModule(id, token);
            if (functionsRes.status === 200) {
                const functions: FunctionResponse[] = await functionsRes.json();
                return {
                    ...data,
                    functions
                };
            } else {
                const errorData: ErrorResponse = await functionsRes.json();
                toast.error(errorData.message.toString());
                throw new Error(errorData.message);
            }
        } else {
            const errorData: ErrorResponse = await res.json();
            toast.error(errorData.message.toString());
            throw new Error(errorData.message);
        }
    }, [token]);

    const getModulesHandler = useCallback(async (ids: number[]): Promise<ModuleResponse[]> => {
        const modules: ModuleResponse[] = [];

        for (const id of ids) {
            try {
                const module_ = await getModuleHandler(id);
                modules.push(module_);
            } catch (error) {
                console.error(`Error obteniendo el usuario con ID ${id}: ${error}`);
            }
        }
        return modules;
    }, [getModuleHandler]);

    const getFunctionHandler = useCallback(async (id: number): Promise<FunctionResponse> => {
        const res = await getFunction(id, token);
        if (res.status === 200) {
            const data: FunctionResponse = await res.json();
            return {
                id: data.id,
                name: data.name,
                status: data.status
            };
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

    const data = renderData(modules, 0, "Module");

    useEffect(() => {
        const ids = getIdSelectedItems();
        getModulesHandler(ids).then((modules) => {
            setModules(modules);
        });
    }, []);

    return (
        <ReportHeader data={data} dataType='Modules' />
    );
}

export default relationalModules;