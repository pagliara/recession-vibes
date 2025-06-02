import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/header'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Recession Vibes | Economic Indicators Dashboard',
  description: 'Weekly tracking of key economic indicators that signal recession risk',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <Header />
        <Script src="https://scripts.simpleanalyticscdn.com/latest.js"  />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
