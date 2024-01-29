import React, { useCallback, useEffect } from 'react';
import { ModuleResponse } from '@/types/Module/ModuleResponse';
import { getModule } from '@/services/Module/ModuleService';
import { useAuthToken } from '@/hooks/useAuthToken';
import { ErrorResponse } from '@/types/shared/ValidationError';
import { toast } from 'sonner';
import { ReporType } from '@/types/Reports/shared/Report';
import { renderData } from '@/types/Reports/shared/FormatData';
import {ReportHeader} from "@/types/Reports/shared/HeaderReport";

export function BasicModules<TData>({
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

    const getModuleHandler = useCallback(async (id: number): Promise<ModuleResponse> => {
        const res = await getModule(id, token);
        if (res.status === 200) {
            const data: ModuleResponse = await res.json();
            return data;
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
                const module = await getModuleHandler(id);
                modules.push(module);
            } catch (error) {
                console.error(`Error obteniendo el usuario con ID ${id}: ${error}`);
            }
        }
        return modules;
    }, [getModuleHandler]);

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

export default BasicModules;