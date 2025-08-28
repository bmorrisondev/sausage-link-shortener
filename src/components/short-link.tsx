import React from 'react';

interface ShortLinkProps {
  url: string;
}

export function ShortLink({ url }: ShortLinkProps) {
  return <div className="text-sm font-mono text-foreground-base">{url}</div>;
}

export default ShortLink;
