import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import LinkGraph from './link-graph';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface LinksGraphSearchProps {
  query: string;
  limit?: number;
}

export function LinksGraphSearch({ query, limit = 10 }: LinksGraphSearchProps) {
  const searchResults = useQuery(api.links.searchLinks, {
    query: query.trim() || undefined,
    limit,
  });

  if (!searchResults) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (searchResults.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">
              No links found for &ldquo;{query}&rdquo;
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            Analytics for &ldquo;{query}&rdquo; ({searchResults.length} result
            {searchResults.length !== 1 ? 's' : ''})
          </CardTitle>
        </CardHeader>
      </Card>

      {searchResults.map((link) => (
        <div key={link._id} className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-foreground-light">
            <span className="font-mono">{link.slug}</span>
            <span>•</span>
            <span className="truncate">{link.destination}</span>
            {link.description && (
              <>
                <span>•</span>
                <span className="truncate">{link.description}</span>
              </>
            )}
          </div>
          <LinkGraph id={link._id} />
        </div>
      ))}
    </div>
  );
}

export default LinksGraphSearch;
