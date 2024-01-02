'use client'

import React, { use } from 'react'
import Header from '@/components/Header'
import { createFunction, getFunction, updateFunction } from '@/services/Function/FunctionService'
import { CreateFunctionRequest } from '@/types/Function/CreateFunctionRequest'
import { ErrorResponse, ValidationErrorResponse } from '@/types/shared/ValidationError'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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
import { getModules } from '@/services/Module/ModuleService'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { stat } from 'fs'
import { UpdateFunctionRequest } from '@/types/Function/UpdateFunctionRequest'

export default function FunctionUpdateForm({params}: any) {

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

    useEffect(() => {
        const fetchFunction = async () => {
            try {
                const res = await getFunction(id);
                console.log(id);
                if (res.status === 200) {
                    const data = await res.json();
                    setFunction(data);
                    form.reset(data);
                } else {
                    router.push("/dashboard/function");
                    toast.error("Function not found");
                }
            } catch (err) {
                toast.error("Error to get function");
            }
        };
        fetchFunction();
    }, [id]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const res = await updateFunction(params.id, data);
            if (res.status === 200) {
                toast.success("Funtion updated successfully");
                router.push("/dashboard/module");
            } else {
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
        name: z.string().min(3).max(50),
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

    const getModulesHandler = async () => {
        await getModules().then((res) => {
            if (res.status === 200) {
                return res.json().then((data) => {
                    setModules(data);
                });
            }
            window.alert('Error');
        }).catch((err) => {
            window.alert('Error');
        });
    }

    useEffect(() => {
        getModulesHandler();
    }, []);


    return (
        <>
            <Header title='Update Function' />
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
                                            <FormLabel>Nombre del Función</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Escribe un nombre de la Función" {...field} />
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
                                            <FormLabel>Módulos</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(Number(value))}
                                                defaultValue={field.value.toString()}
                                                value={field.value.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona un módulo" />
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
}
