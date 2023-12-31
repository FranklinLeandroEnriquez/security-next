import { ModuleResponse } from '@/types/Module/ModuleResponse';
export interface FunctionResponse {
    id: number;
    name: string;
    module: ModuleResponse;
    status: boolean;
}
