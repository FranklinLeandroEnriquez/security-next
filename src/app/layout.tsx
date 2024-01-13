
import { Inter, Plus_Jakarta_Sans } from "next/font/google"

import '../styles/globals.css'
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: 'Security Module',
  description: 'Security Module',
}

const inter = Inter({ subsets: ['latin'] })
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="en" className='h-full'>
      <body
        className={cn(
          // 'relative z-10 h-full font-sans antialiased',
          'h-full m-0 p-0 font-sans antialiased',
          inter.className
        )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
