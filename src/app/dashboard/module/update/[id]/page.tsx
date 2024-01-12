'use client'

import { getModule, updateModule } from "@/services/Module/ModuleService";
import { UpdateModuleRequest } from "@/types/Module/UpdateModuleRequest";
import { ErrorResponse, ValidationErrorResponse } from "@/types/shared/ValidationError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Header from '@/components/Header'
import React from 'react'
import { getIp, logAuditAction } from "@/services/Audit/AuditService";
import { useAuthToken } from "@/hooks/useAuthToken";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { FilePieChartIcon } from "lucide-react";
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
import { toast } from "sonner";
import validFunctions from '@/providers/ValidateFunctions'

function ModuleUpdateFomr({ params }: any) {

    const [module, setModule] = useState<UpdateModuleRequest>({} as UpdateModuleRequest);
    const [errors, setErrors] = useState<ValidationErrorResponse | null>(null);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);

    const router = useRouter();
    const { id } = params;
    const token = useAuthToken();

    useEffect(() => {
        const fetchModule = async () => {
            const ip = await getIp();
            try {
                const res = await getModule(id, token);
                if (res.status === 200) {
                    const data = await res.json();
                    setModule(data);
                    form.reset(data);
                    await logAuditAction({
                        functionName: 'SEC-MODULES-READ',
                        action: 'get Module',
                        description: 'Successfully fetched module',
                        observation: `Module name: ${data.name}`,
                        ip: ip.toString(),
                    }, token);
                } else {
                    await logAuditAction({
                        functionName: 'SEC-MODULES-READ',
                        action: 'get Module',
                        description: 'Failed to fetch module',
                        ip: ip.toString(),
                    }, token);
                    router.push("/dashboard/module");
                    toast.error("Module not found");
                }
            } catch (err) {
                toast.error("Error to get module");
            }
        };

        fetchModule();
    }, [id]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const ip = await getIp();
        try {
            const res = await updateModule(params.id, data, token);
            if (res.status === 200) {
                await logAuditAction({
                    functionName: 'SEC-MODULES-UPDATE',
                    action: 'update Module',
                    description: 'Successfully updated module',
                    observation: `Module name: ${data.name}`,
                    ip: ip.toString(),
                }, token);
                toast.success("Module updated successfully");
                router.push("/dashboard/module");
            } else {
                await logAuditAction({
                    functionName: 'SEC-MODULES-UPDATE',
                    action: 'update Module',
                    description: 'Failed to update module',
                    ip: ip.toString(),
                }, token);
                const data: ValidationErrorResponse = await res.json();
                if (data.error == 'ValidationException') {
                    setErrorResponse(null);
                    setErrors(data);
                    toast.error(data.message.toString());
                } else {
                    setErrors(null);
                    setErrorResponse({
                        error: data.error,
                        message: data.message.toString(),
                        statusCode: data.statusCode,
                        path: data.path,
                        date: data.date,
                    });
                    toast.error(data.message.toString());
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    const formSchema = z.object({
        name: z.string().min(5, {
            message: 'Name must be at least 5 characters'
        }).max(50, {
            message: 'Name must be less than 50 characters'
        }),
        description: z.string().min(5, {
            message: 'Description must be at least 5 characters'
        }).max(50,
            {
                message: 'Description must be less than 50 characters'
            }),
        status: z.boolean(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            status: true,
        }
    });

    return (
        <>
            <Header title="Update Module" icon={<FilePieChartIcon size={25} />} />
            <div className="flex justify-center items-center mt-10">
                <Card className="w-[40%]">
                    <CardHeader>
                        <CardTitle>Update Module</CardTitle>
                        <CardDescription>
                            Update a new module - <strong>Security Module</strong>
                        </CardDescription>
                    </CardHeader>
                    <div data-orientation="horizontal" role="none" className="shrink-0 mb-4 bg-border h-[1px] w-full"></div>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Module Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Write a module name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Write a description" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <FormControl>
                                                <Input type="checkbox" checked={field.value ? true : false} {...field} value={field.value ? "true" : "false"} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-between">
                                    <Button variant="outline" type="button" onClick={() => router.push("/dashboard/module")}>Cancel</Button>
                                    <Button
                                        type="submit"
                                        value="Save"
                                    >Update</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

            </div>
        </>
    )
};

export default validFunctions(ModuleUpdateFomr, 'SEC-MODULES-UPDATE');

