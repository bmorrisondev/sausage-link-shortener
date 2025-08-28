'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { Copy, Check } from 'lucide-react';
import { DancingEmojis } from './dancing-emojis';
import { EditLinkModal } from './edit-link-modal';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface ShortLinkData {
  slug: string;
  destination: string;
  description?: string;
  qr_code?: string;
  _id: string;
}

interface ShortLinkBaseProps {
  link: ShortLinkData;
}

export function ShortLinkBase({ link }: ShortLinkBaseProps) {
  const base = process.env.NEXT_PUBLIC_REDIRECT_BASE_URL;
  const [copied, setCopied] = useState(false);

  const shortUrl = `${base}/l/${link.slug}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const deleteLinkMutation = useMutation(api.links.deleteLink);

  return (
    <div className="relative w-full max-w-lg p-4 rounded-2xl bg-background-toast shadow-lg">
      <div className="p-4 rounded-xl bg-background-oats">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-accent-strawberry rounded-full w-3 h-3"></div>
          <div className="bg-accent-yolk rounded-full w-3 h-3"></div>
          <div className="bg-accent-avocado rounded-full w-3 h-3"></div>
        </div>

        <div className="space-y-3">
          {link.qr_code && (
            <div className="flex justify-center pt-3 border-t border-background-latte">
              <div className="flex flex-col items-center gap-2">
                <Image
                  src={link.qr_code}
                  alt="QR Code"
                  width={120}
                  height={120}
                  className="rounded-lg"
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between ">
            <Link
              href={`${base}/l/${link.slug}`}
              className="font-mono text-sm text-foreground-base flex-1 mr-2"
            >
              <DancingEmojis slug={link.slug} />
            </Link>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={copyToClipboard}
                title="Copy link"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-accent-avocado" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="text-sm text-foreground-light">
            <span className="font-medium">Original URL:</span>{' '}
            {link.destination}
          </div>

          {link.description && (
            <div className="text-sm text-foreground-light">
              <span className="font-medium">Description:</span>{' '}
              {link.description}
            </div>
          )}
        </div>
        <div className="flex space-x-4">
          <EditLinkModal link={link} />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteLinkMutation({ linkId: link._id })}
          >
            delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShortLinkBase;
