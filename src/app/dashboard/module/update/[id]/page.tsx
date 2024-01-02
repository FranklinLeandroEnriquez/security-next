'use client'

import { getModule, updateModule } from "@/services/Module/ModuleService";
import { UpdateModuleRequest } from "@/types/Module/UpdateModuleRequest";
import { ErrorResponse, ValidationErrorResponse } from "@/types/shared/ValidationError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Header from '@/components/Header'
import React from 'react'

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
import { stat } from "fs";

export default function ModuleUpdateFomr({ params }: any) {

    const [module, setModule] = useState<UpdateModuleRequest>({} as UpdateModuleRequest);
    const [errors, setErrors] = useState<ValidationErrorResponse | null>(null);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);

    const router = useRouter();
    useEffect(() => {
        const { id } = params;

        getModule(id).then(async (res) => {
            if (res.status === 200) {
                return res.json().then((data) => {
                    setModule(data);
                    //Esta linea es para que se actualice el formulario
                    form.setValue("name", data.name);
                    form.setValue("description", data.description);
                    form.setValue("status", data.status);
                });
            }
            router.push("/dashboard/module");
            return toast.error("Module not found");

        }).catch((err) => {
            return toast.error("Error to get module");
        });
    }, []);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await updateModule(params.id, data).then(async (res) => {
                if (res.status === 200) {
                    toast.success("Module updated successfully");
                    return router.push("/dashboard/module");
                }

                await res.json().then((data: ValidationErrorResponse) => {
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
                });
            }).catch((err) => {
                toast.error(err.message);
            });
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
            <Header title="Update Module" />
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
}

