import {  UserResponse} from '@/types/User/UserResponse'
import { RoleResponse } from '@/types/Role/RoleResponse'
import {  FunctionResponse } from '@/types/Function/FunctionResponse'
import {  ModuleResponse } from '@/types/Module/ModuleResponse'

export interface UserReport {
    user: UserResponse;
    roles: RoleResponse[];
}