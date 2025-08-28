'use client'

import { useEffect, useState } from 'react'

interface Props {
  emojis: string;
  isLoading: boolean;
}

interface EmojiPosition {
  id: number;
  char: string;
  jumpPhase: number; // 0 to 1 representing the phase of the jump
  jumpSpeed: number; // Speed of the jump cycle
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
      char,
      jumpPhase: Math.random(), // Random starting phase
      jumpSpeed: 0.05 + Math.random() * 0.05 // Random jump speed
    }));
    
    setPositions(initialPositions);
  }, [emojis]);
  
  // Animate the emojis
  useEffect(() => {
    if (!isLoading || positions.length === 0) return;
    
    const interval = setInterval(() => {
      setPositions(prev => prev.map(emoji => {
        // Update jump phase
        const newJumpPhase = (emoji.jumpPhase + emoji.jumpSpeed) % 1;
        
        return {
          ...emoji,
          jumpPhase: newJumpPhase // Update jump phase
        };
      }));
    }, 150); // Update every 150ms
    
    return () => clearInterval(interval);
  }, [isLoading, positions]);
  
  // If not loading or no emojis, just display the emojis normally
  if (!isLoading) {
    return <div className="text-6xl mb-4">{emojis}</div>;
  }
  
  return (
    <div className="text-6xl mb-4 flex justify-center">
      {positions.map((emoji) => (
        <div
          key={emoji.id}
          className="inline-block transition-all duration-150 ease-in-out"
          style={{
            transform: `translateY(${-Math.abs(Math.sin(emoji.jumpPhase * Math.PI * 2) * 15)}px)`,
          }}
        >
          {emoji.char}
        </div>
      ))}
    </div>
  );
}
