'use client'

import { getRoles } from "@/services/Role/RoleService"
import { RoleResponse } from "@/types/Role/RoleResponse"
import { FunctionResponse } from "@/types/Function/FunctionResponse"
import { useRouter } from "next/navigation"
import { assignFunctions } from "@/services/Role/RoleService"
import { getFunctionsOfRole } from "@/services/Role/RoleService"
import { getFunctions } from "@/services/Function/FunctionService"
import { useEffect, useState } from "react"
import { FunctionSquareIcon, UsersRound } from "lucide-react"
import Header from "@/components/Header"
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import ScrollableCheckboxList from "@/components/ui/scroll-area"
import CustomSelect from "@/components/ui/select-filter"
import { Function } from "@/types/Function/columns"
import { Button } from "@/components/ui/button"


export default function AssignFunction() {
    const [roles, setRoles] = useState<RoleResponse[]>([])
    const [selectedRole, setSelectedRole] = useState<number | null>(null)
    const [availableFunctions, setAvailableFunctions] = useState<FunctionResponse[]>([])
    const [roleFunctions, setRoleFunctions] = useState<FunctionResponse[]>([])

    const router = useRouter()

    const getRolesHandler = async () => {
        const res = await getRoles()
        if (res.status === 200) {
            const data = await res.json()
            // Filtrar roles con status igual a true
            const filteredRoles: RoleResponse[] = data.filter((role: RoleResponse) => role.status === true);
            setRoles(filteredRoles);
        } else {
            window.alert("Error")
        }
    }

    const getFunctionsOfRoleHandler = async (roleId: number) => {
        const res = await getFunctionsOfRole(roleId)
        if (res.status === 200) {
            const data = await res.json()
            const filteredFunctions: FunctionResponse[] = data.filter((function_: FunctionResponse) => function_.status === true);
            setRoleFunctions(filteredFunctions)
        } else {
            window.alert("Error")
        }
    }

    const getFunctionsHandler = async () => {
        const res = await getFunctions()
        if (res.status === 200) {
            const data = await res.json()
            const filteredFunctions: FunctionResponse[] = data.filter((function_: FunctionResponse) => function_.status === true);
            setAvailableFunctions(filteredFunctions)
        } else {
            window.alert("Error")
        }
    }

    const handleRoleChange = (roleId: number) => {
        setSelectedRole(roleId);
        getFunctionsOfRoleHandler(roleId);
        getFunctionsHandler();
    };

    const handleFunctionAssignment = (function_: FunctionResponse) => {
        const newRoleFunctions = roleFunctions.some(f => f.id === function_.id)
            ? roleFunctions.filter(f => f.id !== function_.id)
            : [...roleFunctions, function_];

        let newAvailableFunctions = availableFunctions;

        if (!roleFunctions.some(f => f.id === function_.id)) {

            if (!newAvailableFunctions.some(f => f.id === function_.id)) {
                newAvailableFunctions = [...newAvailableFunctions, function_];
            }
        }

        setAvailableFunctions(newAvailableFunctions);
        setRoleFunctions(newRoleFunctions);
    };



    const handleAssignFunctions = async () => {
        if (selectedRole) {
            const functionIds = roleFunctions.map(f => f.id)
            try {
                const res = await assignFunctions(selectedRole, { roleId: selectedRole, functionIds });
                if (res.status === 201) {
                    window.alert('Roles asignados correctamente');
                } else {
                    const errorData = await res.json();
                    window.alert(`Error al asignar roles: ${errorData.message}`);
                }
            } catch (err) {
                window.alert("Error")
            }
        }
    }

    useEffect(() => {
        getRolesHandler()
    }, [])

    return (
        <>
            <Header title="Assing Functions" IconComponent={FunctionSquareIcon} />
            <MaxWidthWrapper className="mt-8">
                <CustomSelect
                    options={[
                        { label: "Select a role...", value: 0 },
                        ...roles.map((role) => ({ label: role.name, value: role.id }))
                    ]}
                    onSelect={(selectedValue) => handleRoleChange(selectedValue)}
                    placeholder="Select a role..."
                />

                {selectedRole && (
                    <div className="flex space-x-4 mt-4">
                        <div className="flex-1 p-4 border rounded">
                            <label>Available Functions:</label>
                            <ScrollableCheckboxList<Function>
                                items={availableFunctions.filter(function_ => !roleFunctions.some(roleFunction => roleFunction.id === function_.id))}
                                checkedItems={roleFunctions}
                                onChange={handleFunctionAssignment}
                                getKey={(function_) => function_.id.toString()}
                                renderItem={(function_) => (
                                    <>
                                        <span>{function_.id}</span>
                                        <span className="ml-2">{function_.name}</span>
                                    </>
                                )}
                            />
                        </div>

                        <div className="flex-1 p-4 border rounded">
                            <label>Role Functions:</label>
                            <ScrollableCheckboxList<Function>
                                items={roleFunctions}
                                checkedItems={roleFunctions}
                                onChange={handleFunctionAssignment}
                                getKey={(function_) => function_.id.toString()}
                                renderItem={(function_) => (
                                    <>
                                        <span>{function_.id}</span>
                                        <span className="ml-2">{function_.name}</span>
                                    </>
                                )}
                            />
                        </div>
                    </div>
                )}
                <div className="flex justify-center">
                    <Button onClick={handleAssignFunctions} className="mt-8 w-1/3">
                        Assign
                    </Button>
                </div>
            </MaxWidthWrapper>

        </>
    )
}