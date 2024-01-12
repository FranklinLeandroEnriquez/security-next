'use client'

import { getRoles } from "@/services/Role/RoleService"
import { RoleResponse } from "@/types/Role/RoleResponse"
import { FunctionResponse } from "@/types/Function/FunctionResponse"
import { useRouter } from "next/navigation"
import { assignFunctions } from "@/services/Role/RoleService"
import { getFunctionsOfRole } from "@/services/Role/RoleService"
import { getFunctions } from "@/services/Function/FunctionService"
import { useEffect, useState } from "react"
import { ModuleResponse } from "@/types/Module/ModuleResponse"
import Accordion from "@/components/ui/accordion"
import Header from "@/components/Header"
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import ScrollableCheckboxList from "@/components/ui/scroll-area"
import CustomSelect from "@/components/ui/select-filter"
import { Function } from "@/types/Function/columns"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import validFunctions from '@/providers/ValidateFunctions';
import { getIp, logAuditAction } from "@/services/Audit/AuditService"
import { useAuthToken } from "@/hooks/useAuthToken"
import validFunctions from '@/providers/ValidateFunctions';

function AssignFunction() {
    const [roles, setRoles] = useState<RoleResponse[]>([])
    const [selectedRole, setSelectedRole] = useState<number | null>(null)
    const [availableFunctions, setAvailableFunctions] = useState<FunctionResponse[]>([])
    const [roleFunctions, setRoleFunctions] = useState<FunctionResponse[]>([])

    const router = useRouter()
    const token = useAuthToken()

    const getRolesHandler = async () => {
        const ip = await getIp()
        const res = await getRoles(token)
        if (res.status === 200) {
            const data = await res.json()
            // Filtrar roles con status igual a true
            const filteredRoles: RoleResponse[] = data.filter((role: RoleResponse) => role.status === true);
            setRoles(filteredRoles);
            logAuditAction({
                functionName: 'SEC-ROLES-READ',
                action: 'get roles',
                description: 'Successfully fetched roles',
                ip: ip.toString(),
            }, token);
        } else {
            toast.error('An error has occurred')
        }
    }

    const getFunctionsOfRoleHandler = async (roleId: number) => {
        const ip = await getIp()
        const res = await getFunctionsOfRole(roleId, token)
        if (res.status === 200) {
            const data = await res.json()
            const filteredFunctions: FunctionResponse[] = data.filter((function_: FunctionResponse) => function_.status === true);
            setRoleFunctions(filteredFunctions)
            logAuditAction({
                functionName: 'SEC-FUNCTIONS-TO-ROLE-READ',
                action: 'get role functions',
                description: 'Successfully fetched role functions',
                observation: `Role ID: ${roleId}`,
                ip: ip.toString(),
            }, token);
        } else {
            toast.error('An error has occurred')
        }
    }

    const getFunctionsHandler = async () => {
        const ip = await getIp()
        const res = await getFunctions(token)
        if (res.status === 200) {
            const data = await res.json()
            const filteredFunctions: FunctionResponse[] = data.filter((function_: FunctionResponse) => function_.status === true);
            setAvailableFunctions(filteredFunctions)
            logAuditAction({
                functionName: 'SEC-FUNCTIONS-READ',
                action: 'get functions',
                description: 'Successfully fetched functions',
                ip: ip.toString(),
            }, token);
        } else {
            toast.error('An error has occurred')
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
        const ip = await getIp()
        if (selectedRole) {
            const functionIds = roleFunctions.map(f => f.id)
            try {
                const res = await assignFunctions(selectedRole, { roleId: selectedRole, functionIds }, token);
                if (res.status === 201) {
                    logAuditAction({
                        functionName: 'SEC-FUNCTIONS-TO-ROLE-UPDATE',
                        action: 'assign functions to role',
                        description: 'Successfully assigned functions to role',
                        observation: `Role ID: ${selectedRole}`,
                        ip: ip.toString(),
                    }, token);
                    toast.success("Functions assigned successfully");
                } else {
                    await logAuditAction({
                        functionName: 'SEC-FUNCTIONS-TO-ROLE-UPDATE',
                        action: 'assign functions to role',
                        description: 'Failed to assign functions to role',
                        ip: ip.toString(),
                    }, token);
                    const errorData = await res.json();
                    toast.error("Error assigning functions")
                }
            } catch (err) {
                toast.error("An error has occurred")
            }
        }
    }

    const groupByModule = (functions: FunctionResponse[]) => {
        const grouped = functions.reduce((acc, function_) => {
            const moduleId = function_.module.id;
            if (!acc[moduleId]) {
                acc[moduleId] = {
                    module: function_.module,
                    functions: [],
                };
            }
            acc[moduleId].functions.push(function_);
            return acc;
        }, {} as Record<number, { module: ModuleResponse, functions: FunctionResponse[] }>);

        return Object.values(grouped);
    };

    useEffect(() => {
        getRolesHandler()
    }, [])

    return (
        <>
            <Header title="Assing Functions" />
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
                            <div className="max-h-72 overflow-y-auto border p-4 mb-4">
                                {groupByModule(availableFunctions).map((group, index) => (
                                    <Accordion title={group.module.name} key={index}>
                                        <ScrollableCheckboxList<FunctionResponse>
                                            items={group.functions}
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
                                    </Accordion>
                                ))}
                            </div>
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
                    <Button onClick={handleAssignFunctions} className="mt-2 w-1/3">
                        Assign
                    </Button>
                </div>
            </MaxWidthWrapper>

        </>
    )
};

export default validFunctions(AssignFunction, 'SEC-FUNCTIONS-TO-ROLE-READ');;

export default validFunctions(AssignFunction, 'SEC-FUNCTIONS-TO-ROLE-READ');