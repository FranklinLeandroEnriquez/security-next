'use client'

import { createUser } from "@/services/User/UserService";
import { CreateUserRequest } from "@/types/User/CreateUserRequest";
import { ErrorResponse, ValidationErrorResponse } from "@/types/shared/ValidationError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserCreateForm() {

    const [user, setUser] = useState<CreateUserRequest>({} as CreateUserRequest);
    const [errors, setErrors] = useState<ValidationErrorResponse | null>(null);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);

    const router = useRouter();

    const onSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await createUser(user).then(async (res) => {
                if (res.status === 201) {
                    return router.push("/dashboard/user");
                }

                await res.json().then((data: ValidationErrorResponse) => {
                    if (data.error == 'ValidationException') {
                        setErrorResponse(null);
                        return setErrors(data);
                    }

                    setErrors(null);
                    return setErrorResponse({
                        error: data.error,
                        message: data.message.toString(),
                        statusCode: data.statusCode,
                        path: data.path,
                        date: data.date,
                    });

                });

            }).catch((err) => {
                return window.alert('Error');
            });
        } catch (error) {
            window.alert(error);
        }
    }

    return (
        <div>
            <h1>Crear</h1>

            {errorResponse?.message}

            <form onSubmit={onSubmit}>
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

                <input
                    type="submit"
                    value="Save"
                />
            </form>
        </div>
    );
};

