import { RoleResponse } from "../Role/RoleResponse";

export interface UserResponse {
    id: number;
    username: string;
    email: string;
    dni: string;
    status: boolean;
    password: string;
    roles?: RoleResponse[];
}