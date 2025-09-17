'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { GenericId as Id } from 'convex/values';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EditLinkModal } from '@/components/edit-link-modal';
import LinkQueryList from '@/components/link-query-list';
import ShortLink from '@/components/short-link';
import LinkGraph from '@/components/link-graph';

function DebugPage() {
  const base = process.env.NEXT_PUBLIC_REDIRECT_BASE_URL;
  const [destination, setDestination] = useState('');
  const userLinks = useQuery(api.links.get);
  const insertLinkMutation = useMutation(api.links.insert);
  const deleteLinkMutation = useMutation(api.links.deleteLink);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState<string>();
  const hitLinkMutation = useMutation(api.links.hitLink);
  const allLinks = useQuery(api.links.getAllLinkIds);

  const handleInsertLink = () => {
    insertLinkMutation({ destination });
    setDestination('');
  };

  async function seedLinkHits(){
    if(!allLinks) return
    // Generate 1000 records over the last 7 days
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    for(let i = 0; i < allLinks.length; i++) {
      console.log("working on", allLinks[i], "at index", i, 'out of', allLinks.length)
      for(let j = 0; j < 1000; j++) {
        // Generate a random timestamp between now and 7 days ago
        const randomTimestamp = Math.floor(Math.random() * (now - sevenDaysAgo)) + sevenDaysAgo;
        await hitLinkMutation({ 
          linkId: allLinks[i]._id as Id<"links">, 
          timestamp: randomTimestamp 
      });
    }
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Debug Page</h1>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Links</h2>
        {userLinks?.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic py-4">
            No links found
          </p>
        ) : (
          <ul className="space-y-2">
            {userLinks?.map((link) => (
              <li
                key={link._id}
                className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded"
              >
                <Link
                  href={`${base}/l/${link.slug}`}
                  className="font-mono text-sm bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded hover:underline text-blue-600 dark:text-blue-400"
                >
                  {link.slug}
                </Link>
                <button
                  onClick={() => deleteLinkMutation({ linkId: link._id })}
                >
                  Delete
                </button>
                <EditLinkModal _id={link._id as Id<'links'>} slug={link.slug} destination={link.destination} description={link.description} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Insert Link
        </h2>
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            name="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination URL"
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button onClick={handleInsertLink} disabled={!destination}>
            Insert
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Search Links
        </h2>
        <input
          type="text"
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
        />
        <Button onClick={() => setSearchQuery(searchInput)}>Search</Button>
        <Button onClick={() => setSearchInput('')}>Clear</Button>
        {searchQuery && <LinkQueryList query={searchQuery} />}
      </div>

      <div>
        <h2> dispaly links</h2>
        <ShortLink id="j57czkf8gnjzr13kfjn32rrf317pgp5c" />
      </div>

      <div>
        <h2>Link Graph</h2>
        <Button onClick={seedLinkHits}>Seed Link Hits</Button>
        <LinkGraph id={"j57czkf8gnjzr13kfjn32rrf317pgp5c" as Id<'links'>} />
      </div>
    </div>
  );
}

export default DebugPage;
