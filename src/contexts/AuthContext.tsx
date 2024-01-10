import { createContext } from 'react';
import { AuthResponse } from '@/types/Auth/AuthResponse';

export interface AuthContextType {
    saveAuthResponse: (authResponse: AuthResponse) => void;
    getAuthResponse: () => AuthResponse | null;
    clearAuthResponse: () => void;
}

// Creating the context with an initial undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
