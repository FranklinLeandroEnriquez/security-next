// handlers/users/userHandlers.ts
import { deleteUser, getRolesOfUser, getUsers } from "@/services/User/UserService";
import { getIp, logAuditAction } from '@/services/Audit/AuditService';
import { useRouter } from 'next/router';
import { toast } from "sonner";
import { ErrorResponse } from '@/types/shared/ValidationError';
import { RoleResponse } from "@/types/Role/RoleResponse";

export const getRolesOfUserHandler = async (userId: number, token: string, setUserRoles?: Function) => {
    const ip = await getIp();
    const res = await getRolesOfUser(userId, token);
    if (res.status === 200) {
        const data = await res.json();
        const filteredRoles: RoleResponse[] = data.filter((role: RoleResponse) => role.status === true);
        if (setUserRoles) {
            setUserRoles(filteredRoles);
        }
        await logAuditAction({
            functionName: 'SEC-ROLES-TO-USER-READ',
            action: 'get user roles',
            description: 'Successfully fetched user roles',
            observation: `User ID: ${userId}`,
            ip: ip.toString(),
        }, token);
    } else {
        toast.error('An error has occurred');
    }
}