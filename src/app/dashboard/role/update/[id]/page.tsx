'use client'

import { getRole, updateRole } from "@/services/Role/RoleService"
import { UpdateRoleRequest } from "@/types/Role/UpdateRoleRequest"
import { ErrorResponse, ValidationErrorResponse } from "@/types/shared/ValidationError"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import Header from "@/components/Header"
import React from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { UserCog } from 'lucide-react';

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function RoleUpdateForm({ params }: any) {

    const [role, setRole] = useState<UpdateRoleRequest>({} as UpdateRoleRequest)
    const [errors, setErrors] = useState<ValidationErrorResponse | null>(null)
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null)

    const router = useRouter()
    const { id } = params

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const res = await getRole(id);
                if (res.status === 200) {
                    const data = await res.json();
                    setRole(data);
                    form.reset(data);
                } else {
                    router.push("/dashboard/role");
                    toast.error("Role not found");
                }
            } catch (err) {
                toast.error("Error to get role");
            }
        }

        fetchRole();
    }, [id]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const res = await updateRole(params.id, data)
            if (res.status === 200) {
                toast.success("Role updated successfully")
                router.push("/dashboard/role")
            } else {
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
            }


        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message)
            }
        }
    }

    const formSchema = z.object({
        name: z.string().min(3, {
            message: "Name must be at least 3 characters long",
        }).max(50, {
            message: "Name must be less than 50 characters long",
        }),
        status: z.boolean(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            status: true,
        }
    })

    return (
        <>
            <Header title="Update Role" icon={<UserCog size={25} />} />
            <div className="flex justify-center items-center mt-10">
                <Card className="w-[40%]">
                    <CardHeader>
                        <CardTitle>Update Role</CardTitle>
                        <CardDescription>Update Role - <strong>Security Module</strong></CardDescription>
                    </CardHeader>
                    <div data-aria-orientation="horizontal" role="none" className="shrink-0 mb-4 bg-border h-[1px] w-full"></div>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Role Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Write a role name"{...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-between">
                                    <Button variant="outline" type="button" onClick={() => router.push("/dashboard/role")}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Update Role</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    )

}