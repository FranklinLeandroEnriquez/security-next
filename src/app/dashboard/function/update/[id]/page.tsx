'use client'

import React, { use } from 'react'
import Header from '@/components/Header'
import { createFunction, getFunction, updateFunction } from '@/services/Function/FunctionService'
import { CreateFunctionRequest } from '@/types/Function/CreateFunctionRequest'
import { ErrorResponse, ValidationErrorResponse } from '@/types/shared/ValidationError'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getIp, logAuditAction } from '@/services/Audit/AuditService'
import { useAuthToken } from '@/hooks/useAuthToken'
// New Form
import { PackagePlus } from 'lucide-react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
import { getModules } from '@/services/Module/ModuleService'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { UpdateFunctionRequest } from '@/types/Function/UpdateFunctionRequest'
import validFunctions from '@/providers/ValidateFunctions';

function FunctionUpdateForm({ params }: any) {

    const [functionn, setFunction] = useState<UpdateFunctionRequest>({} as UpdateFunctionRequest);
    const [errors, setErrors] = useState<ValidationErrorResponse | null>(null);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);
    interface Module {
        id: number;
        name: string;
    }

    const [modules, setModules] = useState<Module[]>([]);

    const router = useRouter();
    const { id } = params;
    const token = useAuthToken();

    useEffect(() => {
        const fetchFunction = async () => {
            const ip = await getIp();
            try {
                const res = await getFunction(id, token);
                if (res.status === 200) {
                    const data = await res.json();
                    data.moduleId = data.module.id;
                    setFunction(data);
                    form.reset(data);
                    await logAuditAction({
                        functionName: 'SEC-FUNCTIONS-READ',
                        action: 'get Function',
                        description: 'Successfully fetched function',
                        observation: `Function name: ${data.name}`,
                        ip: ip.toString(),
                    }, token);

                } else {
                    await logAuditAction({
                        functionName: 'SEC-FUNCTIONS-READ',
                        action: 'get Function',
                        description: 'Failed to fetch function',
                        ip: ip.toString(),
                    }, token);
                    router.push("/dashboard/function");
                    toast.error("Function not found");
                }
            } catch (err) {
                toast.error("Error to get function");
            }
        };

        const getModulesHandler = async () => {
            const ip = await getIp();
            await getModules(token).then(async (res) => {
                if (res.status === 200) {
                    await logAuditAction({
                        functionName: 'SEC-MODULES-READ',
                        action: 'get Modules',
                        description: 'Successfully fetched modules',
                        ip: ip.toString(),
                    }, token);
                    return res.json().then((data) => {
                        setModules(data);
                    });
                } else {
                    await logAuditAction({
                        functionName: 'SEC-MODULES-READ',
                        action: 'get Modules',
                        description: 'Failed to fetch modules',
                        ip: ip.toString(),
                    }, token);
                    toast.error("An error has occurred");
                }
            }).catch((err) => {
                toast.error("An error has occurred");
            });
        };

        fetchFunction();
        getModulesHandler();



    }, []);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const ip = await getIp();
        try {
            const res = await updateFunction(params.id, data, token);
            if (res.status === 200) {
                await logAuditAction({
                    functionName: 'SEC-FUNCTIONS-UPDATE',
                    action: 'update Function',
                    description: 'Successfully updated function',
                    observation: `Function name: ${data.name}`,
                    ip: ip.toString(),
                }, token);
                toast.success("Funtion updated successfully");
                router.push("/dashboard/function");
            } else {
                await logAuditAction({
                    functionName: 'SEC-FUNCTIONS-UPDATE',
                    action: 'update Function',
                    description: 'Failed to update function',
                    ip: ip.toString(),
                }, token);
                const errorData: ValidationErrorResponse = await res.json();
                if (errorData.error == 'ValidationException') {
                    setErrorResponse(null);
                    setErrors(errorData);
                    toast.error(errorData.message.toString());
                } else {
                    setErrors(null);
                    setErrorResponse({
                        error: errorData.error,
                        message: errorData.message.toString(),
                        statusCode: errorData.statusCode,
                        path: errorData.path,
                        date: errorData.date,
                    });
                    toast.error(errorData.message.toString());
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };

    const formSchema = z.object({
        name: z.string().min(5, {
            message: 'The name must be at least 5 characters',
        }).max(50, {
            message: 'The name must be less than 50 characters',
        }),
        moduleId: z.number().int().positive(),
        status: z.boolean(),
    });

    const form = useForm<UpdateFunctionRequest>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            moduleId: 0,
            status: true,
        },
    });

    if (functionn.name === undefined) {
        return <></>;
    }

    return (
        <>
            <Header title='Update Function' icon={<PackagePlus size={25} />} />
            <div className="flex justify-center items-center mt-10">
                <Card className="w-[40%]">
                    <CardHeader>
                        <CardTitle>Create Function</CardTitle>
                        <CardDescription>
                            Create a new function - <strong>Security Function</strong>
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
                                            <FormLabel>Function Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Write a function name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="moduleId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Module</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(Number(value))}
                                                defaultValue={field.value.toString()}
                                                value={field.value.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a module" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {modules.map((module) => (
                                                        <SelectItem key={module.id} value={module.id.toString()}>
                                                            {module.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                    <Button variant="outline" type="button" onClick={() => router.push("/dashboard/function")}>Cancel</Button>
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

export default validFunctions(FunctionUpdateForm, 'SEC-FUNCTIONS-UPDATE');
