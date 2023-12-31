'use client';

import { getUsers } from "@/services/User/UserService";
import { UserResponse } from "@/types/User/UserResponse";
import { RoleResponse } from "@/types/Role/RoleResponse";
import { useRouter } from 'next/navigation';
import { assignRoles } from "@/services/User/UserService";
import { getRolesOfUser } from "@/services/User/UserService";
import { getRoles } from "@/services/Role/RoleService";
import { useEffect, useState } from "react";
import { UsersRound } from 'lucide-react';
import Header from "@/components/Header";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ScrollableCheckboxList from "@/components/ui/scroll-area";
import CustomSelect from "@/components/ui/select-filter";
import { Role } from "@/types/Role/columns";
import { Button } from "@/components/ui/button";

export default function AssignRole() {
    const [users, setUsers] = useState<UserResponse[]>([]);
    // const [roles, setRoles] = useState<RoleResponse[]>([]);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [availableRoles, setAvailableRoles] = useState<RoleResponse[]>([]);
    const [userRoles, setUserRoles] = useState<RoleResponse[]>([]);

    const router = useRouter();

    const getUsersHandler = async () => {
        // try {
        const res = await getUsers();
        if (res.status === 200) {
            const data = await res.json();
            setUsers(data);
        } else {
            window.alert('Error');
        }
        // } catch (err) {
        // window.alert('Error');
        // }
    }

    const getRolesOfUserHandler = async (userId: number) => {
        // try {
        const res = await getRolesOfUser(userId);
        if (res.status === 200) {
            const data = await res.json();
            setUserRoles(data);
        } else {
            window.alert('Error');
        }
        // } catch (err) {
        // window.alert('Error');
        // }
    }

    const getRolesHandler = async () => {
        // try {
        const res = await getRoles();
        if (res.status === 200) {
            const data = await res.json();
            setAvailableRoles(data);
        } else {
            window.alert('Error');
        }
        // } catch (err) {
        // window.alert('Error');
        // }
    }

    const handleUserChange = (userId: number) => {
        setSelectedUser(userId);
        getRolesOfUserHandler(userId);
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
        if (selectedUser) {
            const roleIds = userRoles.map(r => r.id);
            try {
                const res = await assignRoles(selectedUser, { userId: selectedUser, roleIds });
                if (res.status === 201) {
                    window.alert('Roles asignados correctamente');
                } else {
                    const errorData = await res.json();
                    window.alert(`Error al asignar roles: ${errorData.message}`);
                }
            } catch (err) {
                window.alert('Error al realizar la solicitud');
                console.error(err);
            }
        }
    };

    useEffect(() => {
        getUsersHandler();
    }, []);

    return (
        <>
            <Header title="Assign Roles" IconComponent={UsersRound} />
            <MaxWidthWrapper className="mt-8">
                <CustomSelect
                    options={[
                        { label: 'Seleccionar usuario...', value: 0 },
                        ...users.map((user) => ({ label: user.username, value: user.id })),
                    ]}
                    onSelect={(selectedValue) => handleUserChange(selectedValue)}
                    placeholder="Seleccionar usuario..."
                />

                {selectedUser && (
                    <div className="flex space-x-4 mt-4"> {/* Agregamos mt-4 para agregar un margen en la parte superior */}
                        <div className="flex-1 p-4 border rounded"> {/* Utilizamos flex-1 para que ocupe el espacio restante y agregamos padding y bordes */}
                            <label>Roles Disponibles:</label>
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
                        </div>

                        <div className="flex-1 p-4 border rounded"> {/* Utilizamos flex-1 para que ocupe el espacio restante y agregamos padding y bordes */}
                            <label>Roles del Usuario:</label>
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
                        </div>
                    </div>
                )}
                <div className="flex justify-center">
                    <Button onClick={handleAssignRoles} className="mt-8 w-1/3">
                        Asignar
                    </Button>
                </div>
            </MaxWidthWrapper>
        </>
    );
};
