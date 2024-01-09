'use client'

import React, { FunctionComponent, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useSessionAuth } from '@/hooks/useSessionAuth';
import { useRouter } from 'next/navigation';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children }) => {
    const router = useRouter();
    const { saveAuthResponse, getAuthResponse, clearAuthResponse } = useSessionAuth();

    const contextValue: AuthContextType = {
        saveAuthResponse,
        getAuthResponse,
        clearAuthResponse
    };


    useEffect(() => {
        const response = getAuthResponse();
        const isAuthenticated = response !== null && response.token !== null;
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [router]);



    return getAuthResponse() ? (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    ) : null;
};
