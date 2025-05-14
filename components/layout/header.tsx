"use client"

import Image from 'next/image'
import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-start py-4">
        <div className="flex gap-6 md:gap-10 items-start">
          <Link href="/" className="flex items-start space-x-3">
            <Image 
              src="/recession-vibes-logo.png" 
              alt="Recession Vibes Logo" 
              width={56} 
              height={56} 
              className="h-10 w-auto"
            />
            <span className="text-2xl md:text-3xl font-bold flex items-center flex-wrap">
              <span className='mr-2'>Recession Vibes</span>
              <h1 className="text-sm text-muted-foreground">
                Economic Indicators Dashboard
              </h1>
              <h2 className="text-sm font-thin text-muted-foreground">
                Weekly updates on key economic indicators that signal recession risk and bear markets.
              </h2>
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          {/* Navigation items can be added here later */}
        </div>
      </div>
    </header>
  )
}
