'use client';
import CardHome, { CardProps } from '@/components/CardHome';
import Header from '@/components/Header'
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { useAuthToken } from '@/hooks/useAuthToken';
import { getRoles } from '@/services/Role/RoleService';
import { getUsers } from '@/services/User/UserService';
import { RoleResponse } from '@/types/Role/RoleResponse';
import { UserResponse } from '@/types/User/UserResponse';
import { ErrorResponse } from '@/types/shared/ValidationError';
import { HomeIcon } from "lucide-react";
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { UserCheck, Users, BarChart2, FunctionSquare } from "lucide-react";
import { getModules } from '@/services/Module/ModuleService';
import { ModuleResponse } from '@/types/Module/ModuleResponse';
import { getFunctions } from '@/services/Function/FunctionService';
import { FunctionResponse } from '@/types/Function/FunctionResponse';

export default function Home() {

    const [cardData, setCardData] = useState<CardProps[]>([]);
    const [loading, setLoading] = useState(true);
    const token = useAuthToken();


    const getUsersLocal = async (): Promise<number> => {
        return getUsers(token).then(async (res) => {
            if (res.status === 200) {
                return res.json().then((data: UserResponse[]) => {
                    return data.length;
                });
            } else {
                const errorData: ErrorResponse = await res.json();
                toast.error(errorData.message.toString());
                return 0;
            }
        }).catch((err) => {
            toast.error('An error has occurred');
            return 0;
        });
    }

    const getRolesLocal = async (): Promise<number> => {
        return getRoles(token).then(async (res) => {
            if (res.status === 200) {
                return res.json().then((data: RoleResponse[]) => {
                    return data.length;
                });
            } else {
                const errorData: ErrorResponse = await res.json();
                toast.error(errorData.message.toString());
                return 0;
            }
        }).catch((err) => {
            toast.error('An error has occurred');
            return 0;
        });
    }

    const getModulesLocal = async (): Promise<number> => {
        return getModules(token).then(async (res) => {
            if (res.status === 200) {
                return res.json().then((data: ModuleResponse[]) => {
                    return data.length;
                });
            } else {
                const errorData: ErrorResponse = await res.json();
                toast.error(errorData.message.toString());
                return 0;
            }
        }).catch((err) => {
            toast.error('An error has occurred');
            return 0;
        });
    }

    const getFunctionNumber = async (): Promise<number> => {
        return getFunctions(token).then(async (res) => {
            if (res.status === 200) {
                return res.json().then((data: FunctionResponse[]) => {
                    return data.length;
                });
            } else {
                const errorData: ErrorResponse = await res.json();
                toast.error(errorData.message.toString());
                return 0;
            }
        }).catch((err) => {
            toast.error('An error has occurred');
            return 0;
        });
    }

    const setNumbers = async () => {
        setCardData([
            {
                label: 'Users',
                description: 'Total number of users',
                amount: await getUsersLocal() || 0,
                icon: Users
            },
            {
                label: 'Roles',
                description: 'Total number of roles',
                amount: await getRolesLocal() || 0,
                icon: UserCheck
            },
            {
                label: 'Modules',
                description: 'Total number of modules',
                amount: await getModulesLocal() || 0,
                icon: BarChart2
            },
            {
                label: 'Functions',
                description: 'Total number of functions',
                amount: await getFunctionNumber() || 0,
                icon: FunctionSquare
            }
        ])

    }

    useEffect(() => {
        setNumbers()
        setLoading(false);
    }, [])



    return (
        <>
            <Header title='Home' icon={<HomeIcon size={26} />} />
            <MaxWidthWrapper className='my-5'>
                {
                    loading ?
                        <div className='flex justify-center h-screen'>
                            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
                        </div>
                        :
                        (
                            <div className="flex flex-col gap-5 w-full">
                                <h2 className="text-4xl text-center font-bold my-5">DATA SUMMARY</h2>

                                <div className="flex flex-col gap-5 w-full">
                                    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                                        {cardData.map((d, i) => (
                                            <CardHome
                                                key={i}
                                                amount={d.amount}
                                                description={d.description}
                                                icon={d.icon}
                                                label={d.label}
                                            />
                                        ))}
                                    </section>
                                </div>
                            </div>
                        )

                }

            </MaxWidthWrapper>
        </>
    )
}
