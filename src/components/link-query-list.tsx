import { useQuery } from 'convex/react';
import React, { useState } from 'react';
import { api } from '../../convex/_generated/api';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Copy, Check } from 'lucide-react';

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
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Search Results: {query}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {links?.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No links found
          </p>
        ) : (
          <div className="space-y-2">
            {links?.map((link) => (
              <div
                key={link._id}
                className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
              >
                <Link
                  href={`/l/${link.slug}`}
                  className="text-primary hover:underline"
                >
                  {link.slug}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(link.slug)}
                  className="h-8 w-8 p-0"
                  title="Copy link"
                >
                  {copiedLinks[link.slug] ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default LinkQueryList;
