'use client'

import { AuthResponse } from "@/types/Auth/AuthResponse";

export interface UseSessionAuthType {
    saveAuthResponse: (authResponse: AuthResponse) => void;
    getAuthResponse: () => AuthResponse | null;
    clearAuthResponse: () => void;
}

// Custom hook to manage AuthResponse in session storage
export const useSessionAuth = (): UseSessionAuthType => {
    // Key to store the data in session storage
    const sessionKey = 'authResponse';

    // Function to save AuthResponse to session storage
    const saveAuthResponse = (authResponse: AuthResponse) => {
        if (typeof window === 'undefined') {
            return;
        }
        sessionStorage.setItem(sessionKey, JSON.stringify(authResponse));
    };

    // Function to get AuthResponse from session storage
    const getAuthResponse = (): AuthResponse | null => {
        if (typeof window === 'undefined') {
            return null;
        }
        const data = sessionStorage.getItem(sessionKey);
        return data ? JSON.parse(data) : null;
    };

    // Function to remove AuthResponse from session storage
    const clearAuthResponse = () => {
        if (typeof window === 'undefined') {
            return;
        }
        sessionStorage.removeItem(sessionKey);
    };

    return { saveAuthResponse, getAuthResponse, clearAuthResponse };
};
