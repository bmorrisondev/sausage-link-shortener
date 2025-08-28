import React from 'react';
import Markdown from 'react-markdown';

interface MarkdownWrapperProps {
  content: string;
}

export function MarkdownWrapper({ content }: MarkdownWrapperProps) {
  return (
    <div className={`prose prose-sm max-w-none `}>
      <Markdown>{content}</Markdown>
    </div>
  );
}

export default MarkdownWrapper;
