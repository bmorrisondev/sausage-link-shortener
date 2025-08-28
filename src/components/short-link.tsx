'use client';

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { ShortLinkBase } from './short-link-base';

interface ShortLinkQueryProps {
  id: string;
}

export function ShortLinkQuery({ id }: ShortLinkQueryProps) {
  const link = useQuery(api.links.getLinkById, { id });

  if (!link) return null;

  return <ShortLinkBase link={link} />;
}

// Keep the original ShortLink export for backward compatibility
export const ShortLink = ShortLinkQuery;

export default ShortLinkQuery;
