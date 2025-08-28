'use client';

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface ShortLinkProps {
  id: string;
}

export function ShortLink({ id }: ShortLinkProps) {
  const base = process.env.NEXT_PUBLIC_REDIRECT_BASE_URL;
  const [copied, setCopied] = useState(false);

  const link = useQuery(api.links.getLinkById, { id });

  if (!link) return null;

  const shortUrl = `${base}/l/${link.slug}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full max-w-md shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <Image src={link.qr_code} alt="QR Code" width={50} height={50} />
            <Link
              href={shortUrl}
              className="text-lg font-medium text-primary hover:underline"
            >
              {link.slug}
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 w-8 p-0"
              title="Copy link"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground truncate">
            <span className="font-medium">URL:</span> {link.destination}
          </div>

          {link.description && (
            <div className="text-sm">
              <span className="font-medium">Description:</span>{' '}
              {link.description}
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" size="sm" asChild className="text-xs">
              <Link
                href={link.destination}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ShortLink;
