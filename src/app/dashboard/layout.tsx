import SideNav from '@/components/SideNav';
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from '@/providers/AuthProvider';
import { UserFunctionProvider, useUserFunctions } from '@/contexts/UserFunctionProvider';



export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <AuthProvider>
            <UserFunctionProvider>
                <Toaster richColors position="top-center" />

                <SideNav />

                <div className='md:ml-60 pd-5'>
                    {children}
                </div>
            </UserFunctionProvider>
        </AuthProvider>
    )
}

