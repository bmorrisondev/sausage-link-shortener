import { useQuery } from 'convex/react';
import React, { useState } from 'react';
import { api } from '../../convex/_generated/api';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Copy, Check } from 'lucide-react';
import ShortLinkBase from './short-link-base';

interface Props {
  query: string;
}

function LinkQueryList({ query }: Props) {
  const links = useQuery(api.links.searchLinks, { query });
  console.log('🚀 ~ LinkQueryList ~ query:', query);

  const [copiedLinks, setCopiedLinks] = useState<Record<string, boolean>>({});

  const copyToClipboard = async (slug: string) => {
    const linkUrl = `${window.location.origin}/l/${slug}`;
    await navigator.clipboard.writeText(linkUrl);
    setCopiedLinks({ ...copiedLinks, [slug]: true });
    setTimeout(() => {
      setCopiedLinks({ ...copiedLinks, [slug]: false });
    }, 2000);
  };

  return (
    <>
      <h2 className="text-xl font-bold">Search Results: {query}</h2>
      {links?.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">No links found</p>
      ) : (
        <div className="space-y-2">
          {links?.map((link) => (
            <div key={link._id}>
              <ShortLinkBase link={link} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default LinkQueryList;
