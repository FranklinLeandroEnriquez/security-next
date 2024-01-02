

import SideNav from '@/components/SideNav';
import { Toaster } from "@/components/ui/sonner"

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
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

