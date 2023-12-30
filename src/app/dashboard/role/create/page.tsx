'use client'

import { createRole } from "@/services/Role/RoleService"
import { CreateRoleRequest } from "@/types/Role/CreateRoleRequest"
import { ErrorResponse, ValidationErrorResponse } from "@/types/shared/ValidationError"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function RoleCreateForm() {
    const [role, setRole] = useState<CreateRoleRequest>({} as CreateRoleRequest)
    const [errors, setErrors] = useState<ValidationErrorResponse | null>(null)
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null)

    const router = useRouter()

    const onSubmit = async (e: any) => {
        e.preventDefault()
        try {
            await createRole(role).then(async (res) => {
                if (res.status === 201) {
                    return router.push("/dashboard/role")
                }

                await res.json().then((data: ValidationErrorResponse) => {
                    if (data.error == 'ValidationException') {
                        setErrorResponse(null)
                        return setErrors(data)
                    }

                    setErrors(null)
                    return setErrorResponse({
                        error: data.error,
                        message: data.message.toString(),
                        statusCode: data.statusCode,
                        path: data.path,
                        date: data.date,
                    })

                })

            }).catch((err) => {
                return window.alert('Error')
            })
        } catch (error) {
            window.alert(error)
        }
    }

    return (
        <div>
            <h1>Crear</h1>

            {errorResponse?.message}

            <form onSubmit={onSubmit}>
                {errors?.message?.find((err) => err.field === 'name')?.errors}
                <input
                    type="text"
                    placeholder="Write a name"
                    onChange={(e) => setRole({ ...role, name: e.target.value })}
                    value = {role.name}
                    required
                />
            
                <input
                    type="submit"
                    value="Save"
                />
            </form>
        </div>
    )

}