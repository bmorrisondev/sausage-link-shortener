import React from 'react';

interface BaconDividerProps {
  count?: number;
  className?: string;
}

export function BaconDivider({ count = 5, className }: BaconDividerProps) {
  const baconEmojis = Array(count).fill('🥓').join(' ');

  return (
    <div className={`flex justify-center py-3 ${className || ''}`}>
      <div className="text-foreground-light  text-xl">{baconEmojis}</div>
    </div>
  );
}

export default BaconDivider;
