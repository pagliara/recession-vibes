import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Recession Indicators Dashboard',
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
      <body>{children}</body>
    </html>
  )
}
