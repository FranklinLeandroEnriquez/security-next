
import { useSessionAuth } from '@/hooks/useSessionAuth';

export function useAuthToken() {
    const { getAuthResponse } = useSessionAuth();

    const authResponse = getAuthResponse();
    const token = authResponse?.token;

    if (!token) {
        throw new Error('Token is undefined');
    }

    return token;
}