'use client';

import { getUsers } from "@/services/User/UserService";
import { UserResponse } from "@/types/User/UserResponse";
import { RoleResponse } from "@/types/Role/RoleResponse";
import { useRouter } from 'next/navigation';
import { assignRoles } from "@/services/User/UserService";
import { getRolesOfUser } from "@/services/User/UserService";
import { getRoles } from "@/services/Role/RoleService";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ScrollableCheckboxList from "@/components/ui/scroll-area"
import CustomSelect from "@/components/ui/select-filter";
import { Role } from "@/types/Role/columns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getIp, logAuditAction } from "@/services/Audit/AuditService";
import { useAuthToken } from "@/hooks/useAuthToken";
import validFunctions from '@/providers/ValidateFunctions';
import { useUserFunctions } from "@/contexts/UserFunctionProvider";
import { getRolesOfUserHandler } from "@/handlers/userRolesHandler"
import exp from "constants";
import { ErrorResponse } from "@/types/shared/ValidationError";

function AssignRole() {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [availableRoles, setAvailableRoles] = useState<RoleResponse[]>([]);
    const [userRoles, setUserRoles] = useState<RoleResponse[]>([]);

    const router = useRouter();
    const token = useAuthToken();

    const userFunctions = useUserFunctions();
    const isAssingUpdate = userFunctions?.includes('SEC-ROLES-TO-USER-UPDATE');
    const isUserRead = userFunctions?.includes('SEC-USERS-READ');
    const isRoleRead = userFunctions?.includes('SEC-ROLES-READ');
    const isAssignRead = userFunctions?.includes('SEC-ROLES-TO-USER-READ');

    const getUsersHandler = async () => {
        const ip = await getIp();
        const res = await getUsers(token);
        if (res.status === 200) {
            const data = await res.json();
            const filteredUsers: UserResponse[] = data.filter((user: UserResponse) => user.status === true);
            setUsers(filteredUsers);
            logAuditAction({
                functionName: 'SEC-USERS-READ',
                action: 'get users',
                description: 'Successfully fetched users',
                ip: ip.toString(),
            }, token);
        } else {
            logAuditAction({
                functionName: 'SEC-USERS-READ',
                action: 'get users',
                description: 'Failed to fetch users',
                ip: ip.toString(),
            }, token);

            const errorData: ErrorResponse = await res.json();
            toast.error(errorData.message.toString());
        }
    }

    // const getRolesOfUserHandler = async (userId: number) => {
    //     const ip = await getIp();
    //     const res = await getRolesOfUser(userId, token);
    //     if (res.status === 200) {
    //         const data = await res.json();
    //         const filteredRoles: RoleResponse[] = data.filter((role: RoleResponse) => role.status === true);
    //         setUserRoles(filteredRoles);
    //         await logAuditAction({
    //             functionName: 'SEC-ROLES-TO-USER-READ',
    //             action: 'get user roles',
    //             description: 'Successfully fetched user roles',
    //             observation: `User ID: ${userId}`,
    //             ip: ip.toString(),
    //         }, token);
    //     } else {
    //         toast.error('An error has occurred');
    //     }
    // }

    const getRolesHandler = async () => {
        const ip = await getIp();
        const res = await getRoles(token);
        if (res.status === 200) {
            const data = await res.json();
            const filteredRoles: RoleResponse[] = data.filter((role: RoleResponse) => role.status === true);
            setAvailableRoles(filteredRoles);
            await logAuditAction({
                functionName: 'SEC-ROLES-READ',
                action: 'get roles',
                description: 'Successfully fetched roles',
                ip: ip.toString(),
            }, token);
        } else {
            const errorData: ErrorResponse = await res.json();
            toast.error(errorData.message.toString());
        }
    }

    const handleUserChange = (userId: number) => {
        setSelectedUser(userId);
        getRolesOfUserHandler(userId, token, setUserRoles);
        getRolesHandler();
    };

    const handleRoleAssignment = (role: RoleResponse) => {
        const newUserRoles = userRoles.some(r => r.id === role.id)
            ? userRoles.filter(r => r.id !== role.id)
            : [...userRoles, role];

        let newAvailableRoles = [...availableRoles];

        if (!userRoles.some(r => r.id === role.id)) {
            // Verifica si el rol ya está en la lista de roles disponibles antes de agregarlo
            if (!newAvailableRoles.some(r => r.id === role.id)) {
                newAvailableRoles = [...newAvailableRoles, role];
            }
        }

        setAvailableRoles(newAvailableRoles);
        setUserRoles(newUserRoles);
    };



    const handleAssignRoles = async () => {
        const ip = await getIp();
        if (selectedUser) {
            const roleIds = userRoles.map(r => r.id);
            try {
                const res = await assignRoles(selectedUser, { userId: selectedUser, roleIds }, token);
                if (res.status === 201) {
                    await logAuditAction({
                        functionName: 'SEC-ROLES-TO-USER-UPDATE',
                        action: 'assign roles to user',
                        description: 'Successfully assigned roles to user',
                        observation: `User ID: ${selectedUser}`,
                        ip: ip.toString(),
                    }, token);
                    toast.success('Roles assgined successfully');
                } else {
                    await logAuditAction({
                        functionName: 'SEC-ROLES-TO-USER-UPDATE',
                        action: 'assign roles to user',
                        description: 'Failed to assign roles to user',
                        ip: ip.toString(),
                    }, token);

                    const errorData: ErrorResponse = await res.json();
                    toast.error(errorData.message.toString());
                }
            } catch (err) {
                toast.error('An error has occurred');
            }
        }
    };

    useEffect(() => {
        getUsersHandler();
    }, []);

    return (
        <>
            <Header title="Assign Roles" />
            <MaxWidthWrapper className="mt-8">
                {isUserRead&&( <CustomSelect
                    options={[
                        { label: 'Select a user...', value: 0 },
                        ...users.map((user) => ({ label: user.username, value: user.id })),
                    ]}
                    onSelect={(selectedValue) => handleUserChange(selectedValue)}
                    placeholder="Select a user..."
                />)}

                {selectedUser && (
                    <div className="flex space-x-4 mt-4"> {/* Agregamos mt-4 para agregar un margen en la parte superior */}
                        {isRoleRead&&( <div className="flex-1 p-4 border rounded"> {/* Utilizamos flex-1 para que ocupe el espacio restante y agregamos padding y bordes */}
                            <label>Available Roles</label>
                            <ScrollableCheckboxList<Role>
                                items={availableRoles.filter(role => !userRoles.some(userRole => userRole.id === role.id))}
                                checkedItems={userRoles}
                                onChange={handleRoleAssignment}
                                getKey={(role) => role.id.toString()}
                                renderItem={(role) => (
                                    <>
                                        <span>{role.id}</span>
                                        <span className="ml-2">{role.name}</span>
                                    </>
                                )}
                            />
                        </div>)}

                        {isAssignRead&&(<div className="flex-1 p-4 border rounded"> {/* Utilizamos flex-1 para que ocupe el espacio restante y agregamos padding y bordes */}
                            <label>User Roles</label>
                            <ScrollableCheckboxList<Role>
                                items={userRoles}
                                checkedItems={userRoles}
                                onChange={handleRoleAssignment}
                                getKey={(role) => role.id.toString()}
                                renderItem={(role) => (
                                    <>
                                        <span>{role.id}</span>
                                        <span className="ml-2">{role.name}</span>
                                    </>
                                )}
                            />
                        </div>)}
                    </div>
                )}
                <div className="flex justify-center">
                    {isAssingUpdate&&(<Button onClick={handleAssignRoles} className="mt-8 w-1/3">
                        Assign
                    </Button>)}
                </div>
            </MaxWidthWrapper>
        </>
    );
};

export default validFunctions(AssignRole, 'SEC-ROLES-TO-USER-READ');
