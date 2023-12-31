
import { Inter } from "next/font/google"
import Image from 'next/image'
import '../styles/globals.css'
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: 'Security Module',
  description: 'Security Module',
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <html lang="en" className='h-full'>
        <body
          className={cn(
            'relative z-10 h-full font-sans antialiased',
            inter.className
          )}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className='flex flex-col min-h-screen'>
              <div className='flex-grow flex-1'>
                {children}
              </div>
            </main>
          </ThemeProvider>


        </body>
      </html>
    </>
  )
}
