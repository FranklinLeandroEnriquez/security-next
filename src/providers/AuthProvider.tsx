'use client'

import React, { FunctionComponent, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useSessionAuth } from '@/hooks/useSessionAuth';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';
import { verifyToken } from '@/services/Auth/AuthService';
import { usePathname } from 'next/navigation'
import { Progress } from "@/components/ui/progress"
import { set } from 'react-hook-form';
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
            }, 250);
        }
    }, [pathname]);


    React.useEffect(() => {
        const timer = setTimeout(() => setProgress(100), 100)
        return () => clearTimeout(timer)
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Progress value={progress} className="w-[60%]" />
            </div>
        );
    }

    return (<AuthContext.Provider value={contextValue}>
        {children}
    </AuthContext.Provider>)
};