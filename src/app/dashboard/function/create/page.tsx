'use client'

import React from 'react'
import Header from '@/components/Header'
import { createFunction } from '@/services/Function/FunctionService'
import { CreateModuleRequest } from '@/types/Module/CreateModuleRequest'
import { CreateFunctionRequest } from '@/types/Function/CreateFunctionRequest'
import { ErrorResponse, ValidationErrorResponse } from '@/types/shared/ValidationError'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Blocks } from 'lucide-react'
import { getIp, logAuditAction } from '@/services/Audit/AuditService';
import { useAuthToken } from '@/hooks/useAuthToken';

// New Form
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getModules } from '@/services/Module/ModuleService';
import validFunctions from '@/providers/ValidateFunctions';



function FunctionCreateFormpage() {

    interface Module {
        id: number;
        name: string;
    }

    const [modules, setModules] = useState<Module[]>([]);

    const router = useRouter();

    const token = useAuthToken();
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const ip = await getIp();
        try {
            const res = await createFunction(values, token);
            if (res.status === 201) {
                await logAuditAction({
                    functionName: 'SEC-FUNCTIONS-CREATE',
                    action: 'create Function',
                    description: 'Successfully created function',
                    observation: `Function name: ${values.name}`,
                    ip: ip.toString(),
                }, token);
                toast.success("Function created successfully");
                return router.push("/dashboard/function");
            }
            await logAuditAction({
                functionName: 'SEC-FUNCTIONS-CREATE',
                action: 'create Function',
                description: 'Failed to create function',
                ip: ip.toString(),
            }, token);
            const data: ValidationErrorResponse = await res.json();
            if (data.error === 'ValidationException') {
                data.message.forEach((error) => {
                    toast.error(error.errors);
                });
            } else {
                toast.error(data.message.toString());
            }
        } catch (err) {
            toast.error("Error while creating function");
        }
    };

    const formSchema = z.object({
        name: z.string().min(5, {
            message: 'The name must be at least 5 characters',
        }).max(50, {
            message: 'The name must be less than 50 characters',
        }),
        moduleId: z.number().int().positive({
            message: 'Select a module',
        }),
    });

    const form = useForm<CreateFunctionRequest>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            moduleId: 0,
        },
    });

    const getModulesHandler = async () => {
        const ip = await getIp();
        await getModules(token).then(async (res) => {
            if (res.status === 200) {
                logAuditAction({
                    functionName: 'SEC-MODULES-READ',
                    action: 'get Modules',
                    description: 'Successfully fetched modules',
                    ip: ip.toString(),
                }, token);
                return res.json().then((data) => {
                    setModules(data);
                });
            } else {
                logAuditAction({
                    functionName: 'SEC-MODULES-READ',
                    action: 'get Modules',
                    description: 'Failed to fetch modules',
                    ip: ip.toString(),
                }, token);

                const errorData: ErrorResponse = await res.json();
                toast.error(errorData.message.toString());
            }

        }).catch((err) => {
            toast.error('An error has occurred');
        });
    }

    useEffect(() => {
        getModulesHandler();
    }, []);

    return (

        <>
            <Header title='Create Function' icon={<Blocks size={25} />} />
            <div className="flex justify-center items-center mt-10">
                <Card className="w-[40%] my-16">
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
                                                defaultValue={field.value === 0 ? "" : field.value.toString()}
                                                value={field.value === 0 ? "" : field.value.toString()}
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
                                <div className="flex justify-between">
                                    <Button variant="outline" type="button" onClick={() => router.push("/dashboard/function")}>Cancel</Button>
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

export default validFunctions(FunctionCreateFormpage, 'SEC-FUNCTIONS-CREATE');
