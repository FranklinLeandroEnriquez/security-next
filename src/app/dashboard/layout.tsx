
import SideNav from '@/components/SideNav';
import MarginWidthWrapper from '@/components/marginWidthWrapper';
import { ThemeProvider } from '@/components/theme-provider';


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                <div className='flex'>
                    <SideNav />
                    <main className="flex-1">
                        <MarginWidthWrapper>
                            {children}
                        </MarginWidthWrapper>
                    </main>

                </div>

            </ThemeProvider>
        </>
    );
}

