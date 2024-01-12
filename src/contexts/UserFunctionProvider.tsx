'use client';
import { useSessionAuth } from '@/hooks/useSessionAuth';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Crear el contexto
const UserFunctionContext = createContext<string[] | null>(null);

// Crear el proveedor del contexto
export const UserFunctionProvider = ({ children }: { children: ReactNode }) => {
    const { getAuthResponse } = useSessionAuth();
    const authResponse = getAuthResponse();
    const [userFunctions, setUserFunctions] = useState<string[] | null>(null);

    useEffect(() => {
        // Aquí puedes actualizar las funciones del usuario cuando cambie el estado de la autenticación
        setUserFunctions(authResponse?.functions || []);
    }, []);

    return (
        <UserFunctionContext.Provider value={userFunctions}>
            {children}
        </UserFunctionContext.Provider>
    );
};

// Crear un hook personalizado para usar el contexto
export const useUserFunctions = () => {
    const context = useContext(UserFunctionContext);
    if (context === undefined) {
        throw new Error('useUserFunctions debe ser usado dentro de un UserFunctionProvider');
    }
    return context;
};