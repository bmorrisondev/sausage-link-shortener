'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DancingEmojis } from '../../../components/dancing-emojis'
import { type GenericId as Id } from 'convex/values'

interface Link {
  _id: Id<"links">;
  _creationTime: number;
  description?: string | undefined;
  qr_code?: string | undefined;
  search_key?: string | undefined;
  destination: string;
  slug: string;
  user_id: string;
}

function LinkPage() {
  const params = useParams()
  const slug = decodeURIComponent(params.slug as string)
  // const link = useQuery(api.links.getLink, { slug })
  const getLink = useMutation(api.links.getLinkAndHit)
  const [link, setLink] = useState<Link | null>(null)

  useEffect(() => {
    async function init() {
      const link = await getLink({ slug })
      if(link){
        setLink(link)
      }
    }
    init()
  }, [slug])
  
  // useEffect(() => {
  //   if (link) {
  //     const redirectTimer = setTimeout(() => {
  //       window.location.href = link.destination
  //     }, 3000)
      
  //     return () => clearTimeout(redirectTimer)
  //   }
  // }, [link])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Emoji Link</h1>
        <DancingEmojis emojis={slug} isLoading={!link} />
      </div>
      <p className="text-lg mb-4">This link redirects to:</p>
      <a 
        href={link?.destination} 
        className="text-blue-600 hover:underline text-xl"
        target="_blank" 
        rel="noopener noreferrer"
      >
        {link?.destination}
      </a>
      <p className="mt-8 text-sm text-gray-500">Redirecting you shortly...</p>
    </div>
  )
}

export default LinkPage