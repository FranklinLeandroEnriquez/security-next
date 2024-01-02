'use client'

import React from 'react'
import Header from '@/components/Header'
import { createFunction } from '@/services/Function/FunctionService'
import { CreateModuleRequest } from '@/types/Module/CreateModuleRequest'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getModules } from '@/services/Module/ModuleService'


export default function FunctionCreateFormpage() {

    const [errors, setErrors] = useState<ValidationErrorResponse | null>(null);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);

    interface Module {
        id: number;
        name: string;
    }

    const [modules, setModules] = useState<Module[]>([]);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const res = await createFunction(values);
            if (res.status === 201) {
                toast.success("Function created successfully");
                return router.push("/dashboard/function");
            }

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
            toast.error("Error to create function");
        }
    };

    const formSchema = z.object({
        name: z.string().min(3).max(50),
        moduleId: z.number().int().positive(),
    });

    const form = useForm<CreateFunctionRequest>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            moduleId: 0,
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
            <Header title='Create Function' />
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
                                <div className="flex justify-between">
                                    <Button variant="outline" type="button" onClick={() => router.push("/dashboard/function")}>Cancel</Button>
                                    <Button
                                        type="submit"
                                        value="Save"
                                    >Crear</Button>
                                </div>
                            </form>

                        </Form>
                    </CardContent>

                </Card>
            </div>

        </>
    )
}
