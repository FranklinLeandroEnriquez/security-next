import { FunctionResponse } from "../Function/FunctionResponse";
import { ModuleResponse } from "../Module/ModuleResponse"; 

export interface ModuleReport {
    module: ModuleResponse;
    functions: FunctionResponse[];
}