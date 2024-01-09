'use client'

import React, { FunctionComponent, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useSessionAuth } from '@/hooks/useSessionAuth';
import { useRouter } from 'next/navigation';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({ children }) => {
    const { saveAuthResponse, getAuthResponse, clearAuthResponse } = useSessionAuth();

    const isAuthenticated = (): boolean => {
        return getAuthResponse() !== null;
    };

    const contextValue: AuthContextType = {
        saveAuthResponse,
        getAuthResponse,
        clearAuthResponse,
        isAuthenticated
    };

    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
