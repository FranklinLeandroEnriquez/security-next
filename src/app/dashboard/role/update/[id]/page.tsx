'use client'

import {getRole, updateRole} from "@/services/Role/RoleService"
import {CreateRoleRequest} from "@/types/Role/CreateRoleRequest"
import {UpdateRoleRequest} from "@/types/Role/UpdateRoleRequest"
import {ErrorResponse, ValidationErrorResponse} from "@/types/shared/ValidationError"
import {useRouter} from "next/navigation"
import {use, useEffect, useState} from "react"

export default function RoleUpdateForm({params}: any) {

    const [role, setRole] = useState<UpdateRoleRequest>({} as UpdateRoleRequest)
    const [errors, setErrors] = useState<ValidationErrorResponse | null>(null)
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null)

    const router = useRouter()
    useEffect(() => {
        const {id} = params

        getRole(id).then(async (res) => {
            if (res.status === 200) {
                return res.json().then((data) => {
                    setRole(data)
                })
            }
            router.push("/dashboard/role")
            return window.alert('Role Not Found')
        }).catch((err) => {
            return window.alert('Error')
        });
        
    }, []);

    const onSubmit = async (e: any) => {
        e.preventDefault()
        try{
            await updateRole(params.id, role).then(async (res) => {
                if (res.status === 200) {
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
            <h1>Update</h1>

            {errorResponse?.message}

            <form onSubmit={onSubmit}>
                {errors?.message?.find((err) => err.field === 'name')?.errors}
                <input
                    type="text"
                    placeholder="Write a name"
                    onChange={(e) => setRole({...role, name: e.target.value})}
                    value={role.name}
                    required
                />

                <input
                    type="submit"
                    value="Update"
                />
            </form>
        </div>
    )

}