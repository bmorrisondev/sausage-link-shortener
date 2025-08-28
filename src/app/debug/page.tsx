'use client'

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function DebugPage() {
  const base = process.env.NEXT_PUBLIC_REDIRECT_BASE_URL
  const [destination, setDestination] = useState('')
  const userLinks = useQuery(api.links.get)
  const insertLinkMutation = useMutation(api.links.insert)

  const handleInsertLink = () => {
    insertLinkMutation({ destination })
    setDestination('')
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Debug Page</h1>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Links</h2>
        {userLinks?.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic py-4">No links found</p>
        ) : (
          <ul className="space-y-2">
            {userLinks?.map((link) => (
              <li key={link._id} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded">
                <Link 
                  href={`${base}/l/${link.slug}`}
                  className="font-mono text-sm bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded hover:underline text-blue-600 dark:text-blue-400"
                >
                  {link.slug}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Insert Link</h2>
        <div className="flex gap-2 mt-4">
          <input 
            type="text" 
            name="destination" 
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination URL" 
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
          />
          <Button 
            onClick={handleInsertLink} 
            disabled={!destination}
          >
            Insert
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DebugPage