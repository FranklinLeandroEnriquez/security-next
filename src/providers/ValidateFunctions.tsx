"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUserFunctions } from '@/contexts/UserFunctionProvider';
import { toast } from 'sonner';

export default function ValidFunctions(Component: any, functionToValidate: string) {
    return function WrappedComponent(props: any) {
        const router = useRouter();
        const userFunctions = useUserFunctions();

        const hasValidFunction = userFunctions ? userFunctions.includes(functionToValidate) : false;
        console.log('hasValidFunction', hasValidFunction);

        useEffect(() => {
            if (userFunctions && userFunctions.length > 0 && !hasValidFunction) {
                router.push('/dashboard/user');
            }
        }, [hasValidFunction, router, userFunctions]);

        if (!hasValidFunction) {
            return null;
        }

        return <Component {...props} />;
    };
}