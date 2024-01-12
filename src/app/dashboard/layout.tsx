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
                <div className='flex h-screen'>
                    <Toaster richColors position="top-center" />
                    <div className="relative flex flex-1 flex-col">
                        <SideNav />
                        <main>
                            <div className='md:ml-60'>
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </UserFunctionProvider>
        </AuthProvider>
    )
}

