'use client'

import React, { FunctionComponent, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useSessionAuth } from '@/hooks/useSessionAuth';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';
import { verifyToken } from '@/services/Auth/AuthService';
import { usePathname } from 'next/navigation'
import { redirect } from 'next/navigation'

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children }) => {
    const pathname = usePathname()
    const { saveAuthResponse, getAuthResponse, clearAuthResponse } = useSessionAuth();

    const contextValue: AuthContextType = {
        saveAuthResponse,
        getAuthResponse,
        clearAuthResponse
    };


    useEffect(() => {
        const auth = getAuthResponse();
        if (auth === null || auth.token === null) {
            redirect('/login')
        } else {
            verifyToken(auth.token).then((response) => {
                if (response.status !== 200) {
                    clearAuthResponse();
                    redirect('/login')
                }
            });
        }
    }, [pathname]);



    return (<AuthContext.Provider value={contextValue}>
        {children}
    </AuthContext.Provider>)
};
