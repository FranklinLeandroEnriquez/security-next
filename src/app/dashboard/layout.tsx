
import Header from '@/components/Header';
import SideNav from '@/components/side-nav';
import MarginWidthWrapper from '@/components/margin-width-wrapper';
import PageWrapper from '@/components/page-wrapper';


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
                        <Header />
                        <PageWrapper>{children}</PageWrapper>
                    </MarginWidthWrapper>
                </main>

            </div>
        </div>
    );
}

