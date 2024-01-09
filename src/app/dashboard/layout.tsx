import SideNav from '@/components/SideNav';
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from '@/providers/AuthProvider';


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <div className='flex h-screen'>
            <Toaster richColors position="bottom-right" />
            <div className="relative flex flex-1 flex-col">
                <SideNav />
                <main>
                    <div className='md:ml-60'>
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </div>
                </main>
            </div>
        </div>

    )
}

