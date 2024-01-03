'use client'

import Header from "@/components/Header";
import { getUser, updateUser } from "@/services/User/UserService";
import { UpdateUserRequest } from "@/types/User/UpdateUserRequest";
import { ErrorResponse, ValidationErrorResponse } from "@/types/shared/ValidationError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { UserRoundSearch } from 'lucide-react';

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

export default function UserUpdateForm({ params }: any) {

    const [user, setUser] = useState<UpdateUserRequest>({} as UpdateUserRequest);
    const [errors, setErrors] = useState<ValidationErrorResponse | null>(null);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);

    const router = useRouter();
    useEffect(() => {
        const { id } = params;

        getUser(id).then(async (res) => {
            if (res.status === 200) {
                return res.json().then((data) => {
                    setUser(data);
                    // Establece los valores de los campos del formulario
                    form.setValue('username', data.username);
                    form.setValue('email', data.email);
                    form.setValue('dni', data.dni);
                    form.setValue('password', data.password);
                    form.setValue('status', data.status);
                });
            }
            router.push("/dashboard/user");
            return window.alert('User Not Found');
        }).catch((err) => {
            return window.alert('Error');
        });

    }, []);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await updateUser(params.id, data).then(async (res) => {
                if (res.status === 200) {
                    toast.success("User updated successfully");
                    return router.push("/dashboard/user");
                }

                await res.json().then((data: ValidationErrorResponse) => {
                    if (data.error == 'ValidationException') {
                        setErrorResponse(null);
                        setErrors(data);
                        toast.error(data.message.toString());
                    }
                    setErrors(null);
                    setErrorResponse({
                        error: data.error,
                        message: data.message.toString(),
                        statusCode: data.statusCode,
                        path: data.path,
                        date: data.date,
                    });
                    toast.error(data.message.toString());

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
        username: z.string().min(5, {
            message: "Name must be at least 5 characters.",
        }),
        email: z.string().email({
            message: "Email is not valid.",
        }),
        dni: z.string().min(10, {
            message: "DNI must be at least 10 characters.",
        }),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        }),
        status: z.boolean(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            dni: "",
            password: "",
            status: true,
        },
    })

    return (
        <>
            <Header title='Update User' icon={<UserRoundSearch size={26} />} />

            <div className="flex justify-center items-center my-10">

                {/* {errorResponse?.message} */}
                <Card className="w-[40%]">
                    <CardHeader>
                        <CardTitle>Update User</CardTitle>
                        <CardDescription>User Update - Security Module.</CardDescription>
                    </CardHeader>
                    <div data-orientation="horizontal" role="none" className="shrink-0 mb-4 bg-border h-[1px] w-full"></div>
                    <CardContent>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your username" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dni"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>DNI</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your DNI" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Enter your password" {...field} />
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
                                    <Button variant="outline" type="button" onClick={() => router.push("/dashboard/user")}>Cancel</Button>
                                    <Button
                                        type="submit"
                                        value="Save"
                                    >Update</Button>
                                </div>
                            </form>
                        </Form>

                        {/* <form onSubmit={onSubmit}>
                            {errors?.message?.find((err) => err.field === 'username')?.errors}
                            <input
                                type="text"
                                placeholder="Write a username"
                                autoFocus
                                onChange={(e) => setUser({ ...user, username: e.target.value })}
                                value={user.username}
                                required
                            />

                            {errors?.message?.find((err) => err.field === 'email')?.errors}
                            <input
                                type="text"
                                placeholder="Write a email"
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                value={user.email}
                                required
                            />

                            {errors?.message?.find((err) => err.field === 'dni')?.errors}
                            <input
                                type="text"
                                placeholder="Write a dni"
                                onChange={(e) => setUser({ ...user, dni: e.target.value })}
                                value={user.dni}
                                required
                            />

                            {errors?.message?.find((err) => err.field === 'password')?.errors}
                            <input
                                type="password"
                                placeholder="Write a password"
                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                                value={user.password}
                                required
                            />

                            {errors?.message?.find((err) => err.field === 'status')?.errors}
                            <input
                                type="checkbox"
                                onChange={(e) => setUser({ ...user, status: !user.status })}
                                checked={user.status ? true : false}
                            />

                            <input
                                type="submit"
                                value="Save"
                            />
                        </form> */}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

