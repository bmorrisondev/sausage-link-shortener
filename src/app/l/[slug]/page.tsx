'use client'

import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

function LinkPage() {
  const params = useParams()
  const slug = decodeURIComponent(params.slug as string)
  const link = useQuery(api.links.getLink, { slug })
  
  // useEffect(() => {
  //   if (link) {
  //     const redirectTimer = setTimeout(() => {
  //       window.location.href = link.destination
  //     }, 3000)
      
  //     return () => clearTimeout(redirectTimer)
  //   }
  // }, [link])

  if (!link) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Emoji Link</h1>
        <div className="text-6xl mb-4">{slug}</div>
      </div>
      <p className="text-lg mb-4">This link redirects to:</p>
      <a 
        href={link.destination} 
        className="text-blue-600 hover:underline text-xl"
        target="_blank" 
        rel="noopener noreferrer"
      >
        {link.destination}
      </a>
      <p className="mt-8 text-sm text-gray-500">Redirecting you shortly...</p>
    </div>
  )
}

export default LinkPage