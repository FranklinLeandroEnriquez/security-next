'use client'

import React, { FunctionComponent, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useSessionAuth } from '@/hooks/useSessionAuth';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';
import { verifyToken } from '@/services/Auth/AuthService';
import { usePathname } from 'next/navigation'
// import { Progress } from "@/components/ui/progress"
import { useRouter } from 'next/navigation'



interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children }) => {
    const pathname = usePathname()
    const { saveAuthResponse, getAuthResponse, clearAuthResponse } = useSessionAuth();
    const [progress, setProgress] = React.useState(0)
    const router = useRouter()

    const contextValue: AuthContextType = {
        saveAuthResponse,
        getAuthResponse,
        clearAuthResponse
    };
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuthResponse();
        if (auth === null || auth.token === null) {
            router.push('/login')
        } else {
            setTimeout(() => {
                verifyToken(auth.token).then((response) => {
                    if (response.status !== 200) {
                        clearAuthResponse();
                        router.push('/login')
                    }
                    setLoading(false);
                });
            }, 200);
        }
    }, []);


    // React.useEffect(() => {
    //     const timer = setTimeout(() => setProgress(100), 50)
    //     return () => clearTimeout(timer)
    // }, []);

    if (loading) {
        return (
            // <div className='flex justify-center items-center h-screen'>
            //     <Progress value={progress} className="w-[60%]" />
            // </div>

            <div className='flex justify-center items-center h-screen'>
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return (<AuthContext.Provider value={contextValue}>
        {children}
    </AuthContext.Provider>)
};