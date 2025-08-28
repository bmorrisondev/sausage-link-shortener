import React from 'react';

interface ShortLinkProps {
  url: string;
  description: string;
  slug: string;
}

export function ShortLink({ url, description, slug }: ShortLinkProps) {
  return (
    <div className="text-sm font-mono text-foreground-base bg-red-500">
      <p>{description}</p>
      <a href={url} className="text-blue-500 hover:underline">
        {slug}
      </a>
    </div>
  );
}

export default ShortLink;
