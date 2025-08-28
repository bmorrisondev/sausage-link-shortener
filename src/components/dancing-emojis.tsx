'use client';

interface Props {
  slug: string;
}

export function DancingEmojis({ slug }: Props) {
  // Use Array.from() or spread operator to properly split emojis
  const emojis = Array.from(slug);
  console.log('Original slug:', slug);
  console.log('Split emojis:', emojis);

  return (
    <div className="relative w-full mb-4 flex items-center justify-center flex-wrap gap-1">
      {emojis.map((char, index) => (
        <span
          key={index}
          className="text-2xl animate-bounce inline-block"
          style={{
            animationDelay: `${index * 100}ms`,
            animationDuration: '1s',
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
