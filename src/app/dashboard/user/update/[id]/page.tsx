'use client'

import { getUser, updateUser } from "@/services/User/UserService";
import { CreateUserRequest } from "@/types/User/CreateUserRequest";
import { UpdateUserRequest } from "@/types/User/UpdateUserRequest";
import { ErrorResponse, ValidationErrorResponse } from "@/types/shared/ValidationError";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserUpdateForm({ params }: any) {

    const [user, setUser] = useState<UpdateUserRequest>({} as UpdateUserRequest);
    const [errors, setErrors] = useState<ValidationErrorResponse | null>(null);
    const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(null);

    const router = useRouter();

    useEffect(() => {
        onLoad();
    });

    const onLoad = async () => {
        const { id } = params;
        await getUser(id).then(async (res) => {
            if (res.status === 200) {
                return res.json().then((data) => {
                    setUser(data);
                });
            }
            router.push("/dashboard/user");
            return window.alert('User Not Found');
        }).catch((err) => {
            return window.alert('Error');
        });
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await updateUser(params.id, user).then(async (res) => {
                if (res.status === 200) {
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
            <h1>Update</h1>


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

                {errors?.message?.find((err) => err.field === 'status')?.errors}
                <input
                    type="checkbox"
                    onClick={(e) => setUser({ ...user, status: !user.status })}
                    checked={user.status ? true : false}
                />

                <input
                    type="submit"
                    value="Save"
                />
            </form>
        </div>
    );
};

