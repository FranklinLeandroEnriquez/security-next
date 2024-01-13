'use client';
import { useContext } from 'react';
import { UserFunctionProvider, useUserFunctions } from '@/contexts/UserFunctionProvider';
import {
    Home, Settings,
    User, UserCheck,
    BarChart2, FunctionSquare,
    BookText, Route
}
    from 'lucide-react';
import { SideNavItems } from './types';


export const useSidevarItems = (): SideNavItems[] => {
    const userFunctions = useUserFunctions();
    const canReadRoles = userFunctions?.includes('SEC-ROLES-READ') || false;
    const canReadUsers = userFunctions?.includes('SEC-USERS-READ') || false;
    const canReadModules = userFunctions?.includes('SEC-MODULES-READ') || false;
    const canReadFunctions = userFunctions?.includes('SEC-FUNCTIONS-READ') || false;
    const canReadAssingToRoles = userFunctions?.includes('SEC-FUNCTIONS-TO-ROLE-READ') || false;
    const canReadAssingToUsers = userFunctions?.includes('SEC-ROLES-TO-USER-READ') || false;
    const casReadAuditTrailReport = userFunctions?.includes('SEC-AUDIT-READ') || false;
    const canReadAuditUserReport = userFunctions?.includes('SEC-AUDIT-USER-REPORT') || false;
    const canReadUsersRolesFunctionsModulesReport = userFunctions?.includes('SEC-USERS-ROLES-FUNCTIONS-MODULES-REPORT') || false;
    const canReadRolesFunctionModulesReport = userFunctions?.includes('SEC-ROLES-FUNCTION-MODULES-REPORT') || false;
    const canReadModulesFunctionsReport = userFunctions?.includes('SEC-MODULES-FUNCTIONS-REPORT') || false;
    return [
        {
            title: "Dashboard",
            path: "/dashboard/",
            icon: <Settings size={20} color="#c59a1a" />,
            submenu: true,
            subMenuItems: [
                {
                    title: "Users",
                    path: "/dashboard/user",
                    icon: <User size={20} />,
                    canRead: canReadUsers
                },
                {
                    title: "Roles",
                    path: "/dashboard/role",
                    icon: <UserCheck size={20} />,
                    canRead: canReadRoles
                },
                {
                    title: "Modules",
                    path: "/dashboard/module",
                    icon: <BarChart2 size={20} />,
                    canRead: canReadModules

                },
                {
                    title: "Functions",
                    path: "/dashboard/function",
                    icon: <FunctionSquare size={20} />,
                    canRead: canReadFunctions
                }
            ],
            canRead: canReadRoles || canReadUsers || canReadModules || canReadFunctions
        },
        {
            title: "Assign",
            path: "/dashboard/",
            icon: <Settings size={20} color="#c59a1a" />,
            submenu: true,
            subMenuItems: [
                {
                    title: "Fuctions to Roles",
                    path: "/dashboard/assign-function",
                    icon: <FunctionSquare size={20} />,
                    canRead: canReadAssingToRoles
                },
                {
                    title: "Roles to Users",
                    path: "/dashboard/assign-role",
                    icon: <UserCheck size={20} />,
                    canRead: canReadAssingToUsers
                },
            ],
            canRead: canReadAssingToRoles || canReadAssingToUsers
        },
        {
            title: "Reports",
            path: "/",
            icon: <BookText size={20} color="#c59a1a" />,
            submenu: true,
            subMenuItems: [
                {
                    title: "Audit Trails",
                    path: "/dashboard/reports/audit",
                    icon: <Route size={20} />,
                    canRead: casReadAuditTrailReport
                },
                {
                    title: "Users",
                    path: "/home",
                    canRead: canReadAuditUserReport
                },
                {
                    title: "Roles",
                    path: "/home",
                    canRead: canReadRolesFunctionModulesReport
                },
                {
                    title: "Modules",
                    path: "/home",
                    canRead: canReadModulesFunctionsReport
                },
                {
                    title: "Functions",
                    path: "/home",
                    canRead: canReadUsersRolesFunctionsModulesReport
                }
            ],
            canRead: casReadAuditTrailReport || canReadAuditUserReport || canReadRolesFunctionModulesReport || canReadModulesFunctionsReport || canReadUsersRolesFunctionsModulesReport
        }
    ]
}