'use client'

import { useEffect, useState } from 'react'

interface Props {
  emojis: string;
  isLoading: boolean;
}

interface EmojiPosition {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  char: string;
}

export function DancingEmojis({ emojis, isLoading }: Props) {
  const [positions, setPositions] = useState<EmojiPosition[]>([]);
  
  // Split the emoji string into an array of individual emoji characters
  useEffect(() => {
    if (!emojis) return;
    
    // Split the emoji string into individual characters
    // This is a simple approach that works for basic emojis
    const emojiChars = Array.from(emojis);
    
    // Create initial positions for each emoji
    const initialPositions = emojiChars.map((char, index) => ({
      id: index,
      x: Math.random() * 100 - 50, // Random position between -50 and 50
      y: Math.random() * 100 - 50, // Random position between -50 and 50
      rotation: Math.random() * 360, // Random rotation
      scale: 0.8 + Math.random() * 0.4, // Random scale between 0.8 and 1.2
      char
    }));
    
    setPositions(initialPositions);
  }, [emojis]);
  
  // Animate the emojis
  useEffect(() => {
    if (!isLoading || positions.length === 0) return;
    
    const interval = setInterval(() => {
      setPositions(prev => prev.map(emoji => ({
        ...emoji,
        x: emoji.x + (Math.random() * 10 - 5), // Move randomly in x direction
        y: emoji.y + (Math.random() * 10 - 5), // Move randomly in y direction
        rotation: (emoji.rotation + Math.random() * 20 - 10) % 360, // Rotate randomly
        scale: Math.max(0.7, Math.min(1.3, emoji.scale + (Math.random() * 0.2 - 0.1))) // Scale randomly within limits
      })));
    }, 150); // Update every 150ms
    
    return () => clearInterval(interval);
  }, [isLoading, positions]);
  
  // If not loading or no emojis, just display the emojis normally
  if (!isLoading) {
    return <div className="text-6xl mb-4">{emojis}</div>;
  }
  
  return (
    <div className="relative h-32 w-full mb-4">
      {positions.map((emoji) => (
        <div
          key={emoji.id}
          className="absolute transition-all duration-150 ease-in-out"
          style={{
            transform: `translate(${emoji.x}px, ${emoji.y}px) rotate(${emoji.rotation}deg) scale(${emoji.scale})`,
            fontSize: '3rem',
            left: '50%',
            top: '50%',
          }}
        >
          {emoji.char}
        </div>
      ))}
    </div>
  );
}
