'use client'

import { createModule } from "@/services/Module/ModuleService";
import { CreateModuleRequest } from "@/types/Module/CreateModuleRequest";
import { ErrorResponse, ValidationErrorResponse } from "@/types/shared/ValidationError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from 'react'

import Header from '@/components/Header'
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


export default function ModuleCreateForm() {

    const [module, setModule] = useState<CreateModuleRequest>({} as CreateModuleRequest);
    const [errors, setErrors] = useState<ValidationErrorResponse | null>(null);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const res = await createModule(values);
            if (res.status === 201) {
                toast.success("Module created successfully");
                return router.push("/dashboard/module");
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
            <Header title='Create Module' />

            <div className="flex justify-center items-center mt-10">
                <Card className="w-[40%]">
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
                                            <FormLabel>Nombre del Módulo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Escribe un nombre del Módulo" {...field} />
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
                                                <Input placeholder="Escribe una descripción" {...field} />
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
