'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export function Analytics() {
  const [isProduction, setIsProduction] = useState(false)
  
  useEffect(() => {
    // Check if we're on the production domain
    setIsProduction(window.location.hostname === 'recessionvibes.net')
  }, [])

  if (!isProduction) {
    return null
  }

  return <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
}
