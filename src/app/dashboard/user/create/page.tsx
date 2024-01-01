'use client'

import { createUser } from "@/services/User/UserService";
import { CreateUserRequest } from "@/types/User/CreateUserRequest";
import { ErrorResponse, ValidationErrorResponse } from "@/types/shared/ValidationError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// New Form
import { Toaster } from "@/components/ui/sonner"
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
import Header from "@/components/Header";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner";

export default function UserCreateForm() {

    const [user, setUser] = useState<CreateUserRequest>({} as CreateUserRequest);
    const [errors, setErrors] = useState<ValidationErrorResponse | null>(null);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await createUser(values).then(async (res) => {
                if (res.status === 201) {
                    toast.success("Usuario creado correctamente");
                    return router.push("/dashboard/user");
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
        username: z.string().min(5, {
            message: "El nombre de usuario debe tener al menos 5 caracteres.",
        }),
        email: z.string(
            {
                required_error: "El email es requerido.",
            }
        ).email({
            message: "Ingrese un email válido.",
        }),
        dni: z.string().min(10, {
            message: "El DNI debe tener al menos 8 caracteres.",
        }),
        password: z.string().min(8, {
            message: "La contraseña debe tener al menos 8 caracteres.",
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            dni: "",
            password: "",
        },
    })

    return (
        <>
            <Header title='Create Users' />

            <div className="flex justify-center items-center mt-10">


                <Card className="w-[40%]">
                    {/* {errorResponse?.message && (
                        <div className="bg-red-100 border flex justify-center border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error! </strong>
                            <span className="block sm:inline">{errorResponse?.message}</span>
                        </div>
                    )} */}
                    <CardHeader>
                        <CardTitle>Create Users</CardTitle>
                        <CardDescription>User Creation - Security Module.</CardDescription>
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
                                            <FormLabel>Nombre de usuario</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Escribe un nombre de usuario" {...field} />
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
                                                <Input placeholder="Escribe un email" {...field} />
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
                                                <Input placeholder="Escribe un DNI" {...field} />
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
                                                <Input type="password" placeholder="Escribe un password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Repite este patrón para los campos email, dni y password */}
                                {/* <Button type="submit">Crear</Button> */}
                                <div className="flex justify-between">
                                    <Button variant="outline" onClick={() => router.push("/dashboard/user")}>Cancel</Button>
                                    <Button
                                        type="submit"
                                        value="Save"
                                    >Crear</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* <Card className="w-[35%]">
                    {errorResponse?.message && (
                        <div className="bg-red-100 border flex justify-center border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error! </strong>
                            <span className="block sm:inline">{errorResponse?.message}</span>
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle>Create Users</CardTitle>
                        <CardDescription>User Creation - Security Module.</CardDescription>
                    </CardHeader>
                    <div data-orientation="horizontal" role="none" className="shrink-0 mb-4 bg-border h-[1px] w-full"></div>
                    <CardContent>
                        <form onSubmit={onSubmit}>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    {errors?.message?.find((err) => err.field === 'username')?.errors && (
                                        <p className="text-red-500 text-base italic">{errors?.message?.find((err) => err.field === 'username')?.errors}</p>
                                    )}
                                    <Input
                                        type="text"
                                        placeholder="Write a username"
                                        autoFocus
                                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                                        value={user.username}
                                        required
                                        className="border p-2 w-full"
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    {errors?.message?.find((err) => err.field === 'email')?.errors && (
                                        <p className="text-red-500 text-base italic">{errors?.message?.find((err) => err.field === 'email')?.errors}</p>
                                    )}
                                    <Input
                                        type="text"
                                        placeholder="Write a email"
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        value={user.email}
                                        required
                                        className="border p-2 w-full"
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    {errors?.message?.find((err) => err.field === 'dni')?.errors && (
                                        <p className="text-red-500 text-base italic">{errors?.message?.find((err) => err.field === 'dni')?.errors}</p>
                                    )}
                                    <Input
                                        type="text"
                                        placeholder="Write a dni"
                                        onChange={(e) => setUser({ ...user, dni: e.target.value })}
                                        value={user.dni}
                                        required
                                        className="border p-2 w-full"
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    {errors?.message?.find((err) => err.field === 'password')?.errors && (
                                        <p className="text-red-500 text-base italic">{errors?.message?.find((err) => err.field === 'password')?.errors}</p>
                                    )}
                                    <Input
                                        type="password"
                                        placeholder="Write a password"
                                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                                        value={user.password}
                                        required
                                        className="border p-2 w-full"
                                    />
                                </div>

                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" onClick={() => router.push("/dashboard/user")}>Cancel</Button>
                                    <Button
                                        type="submit"
                                        value="Save"
                                    >Crear</Button>
                                </CardFooter>
                            </div>
                        </form>
                    </CardContent>
                </Card> */}
            </div >
        </>
    );
};

