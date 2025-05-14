"use client"

import Image from 'next/image'
import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex gap-6 md:gap-10 items-center">
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/recession-vibes-logo.png" 
              alt="Recession Vibes Logo" 
              width={56} 
              height={56} 
              className="h-14 w-auto"
            />
            <span className="text-2xl md:text-3xl font-bold">
              Recession Vibes
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
