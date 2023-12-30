
import Link from 'next/link';
import Header from '@/components/Header';
import SideNav from '@/components/SideNav';
import MarginWidthWrapper from '@/components/marginWidthWrapper';


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <div className='flex'>
                <SideNav />
                <main className="flex-1">
                    <MarginWidthWrapper>
                        {children}
                    </MarginWidthWrapper>
                </main>

            </div>
        </div>
    );
}

