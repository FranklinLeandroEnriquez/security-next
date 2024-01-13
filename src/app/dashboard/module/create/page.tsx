'use client'

import { createModule } from "@/services/Module/ModuleService";
import { CreateModuleRequest } from "@/types/Module/CreateModuleRequest";
import { ErrorResponse, ValidationErrorResponse } from "@/types/shared/ValidationError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from 'react'
import { getIp, logAuditAction } from "@/services/Audit/AuditService";
import { useAuthToken } from "@/hooks/useAuthToken";

import Header from '@/components/Header'
// New Form
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { PieChart } from "lucide-react";
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
import exp from "constants";

function ModuleCreateForm() {

    const [module, setModule] = useState<CreateModuleRequest>({} as CreateModuleRequest);
    const [errors, setErrors] = useState<ValidationErrorResponse | null>(null);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);

    const router = useRouter();
    const token = useAuthToken();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const ip = await getIp();
        try {
            const res = await createModule(values, token);
            if (res.status === 201) {
                await logAuditAction({
                    functionName: 'SEC-MODULES-CREATE',
                    action: 'create Module',
                    description: 'Successfully created module',
                    observation: `Module name: ${values.name}`,
                    ip: ip.toString(),
                }, token);
                toast.success("Module created successfully");
                return router.push("/dashboard/module");
            }
            await logAuditAction({
                functionName: 'SEC-MODULES-CREATE',
                action: 'create Module',
                description: 'Failed to create module',
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
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message.toString());
            } else {
                toast.error("An error occurred");
            }
        }
    };

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
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        }
    });


    return (
        <>
            <Header title='Create Module' icon={<PieChart size={25} />} />

            <div className="flex justify-center items-center mt-10">
                <Card className="w-[40%] my-16">
                    <CardHeader>
                        <CardTitle>Create Module</CardTitle>
                        <CardDescription>
                            Create a new module - <strong>Security Module</strong>
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
                                            <FormLabel>Descripción</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Write a description" {...field} />
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
                                    >Create</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

            </div>
        </>
    )
};

export default validFunctions(ModuleCreateForm, 'SEC-MODULES-CREATE');
