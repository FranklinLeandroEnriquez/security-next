'use client'

import { createRole } from "@/services/Role/RoleService"
import { CreateRoleRequest } from "@/types/Role/CreateRoleRequest"
import { ErrorResponse, ValidationErrorResponse } from "@/types/shared/ValidationError"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getIp, logAuditAction } from "@/services/Audit/AuditService"
import { useAuthToken } from "@/hooks/useAuthToken"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { SquareUserRoundIcon } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import Header from "@/components/Header"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import path from "path"

export default function RoleCreateForm() {
    const [role, setRole] = useState<CreateRoleRequest>({} as CreateRoleRequest)
    const [errors, setErrors] = useState<ValidationErrorResponse | null>(null)
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null)

    const router = useRouter()
    const token = useAuthToken()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const ip = await getIp()
        try {
            const res = await createRole(values)
            if (res.status === 201) {
                await logAuditAction({
                    functionName: 'SEC-ROLES-CREATE',
                    action: 'create Role',
                    description: 'Successfully created role',
                    observation: `Role name: ${values.name}`,
                    ip: ip.toString(),
                }, token)
                toast.success("Role created successfully")
                return router.push("/dashboard/role")
            }
            await logAuditAction({
                functionName: 'SEC-ROLES-CREATE',
                action: 'create Role',
                description: 'Failed to create role',
                ip: ip.toString(),
            }, token)
            const data: ValidationErrorResponse = await res.json()
            if (data.error == 'ValidationException') {
                setErrorResponse(null)
                setErrors(data)
                toast.error(data.message.toString())
            } else {
                setErrors(null)
                setErrorResponse({
                    error: data.error,
                    message: data.message.toString(),
                    statusCode: data.statusCode,
                    path: data.path,
                    date: data.date
                })
                toast.error(data.message.toString())
            }
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message.toString())
            } else {
                toast.error("An error has occurred")
            }
        }
    }

    const formSchema = z.object({
        name: z.string().min(5, {
            message: "Name must be at least 5 characters long",
        }).max(50, {
            message: "Name must be less than 50 characters long",
        }),

    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        }
    })
    return (
        <>
            <Header title="Create Role" icon={<SquareUserRoundIcon size={25} />} />
            <div className="flex justify-center items-center mt-10">
                <Card className="w-[40%]">
                    <CardHeader>
                        <CardTitle>Create Role</CardTitle>
                        <CardDescription>Role Creation - Security Module</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="name">Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Name..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-between">
                                    <Button variant="outline" type="button" onClick={() => router.push("/dashboard/role")}>Cancel</Button>
                                    <Button
                                        type="submit"
                                        value="Save"
                                    >Create</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>

    )

}