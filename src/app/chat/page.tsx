import React from 'react';
import Chat from '@/components/chat';

function ChatPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Chat
        title="Sausage Links Assistant"
        placeholder="Create a short link for..."
        initialMessages={[
          {
            id: '1',
            content:
              "Hello! I'm your Sausage Links AI assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date(),
          },
        ]}
      />
    </div>
  );
}

export default ChatPage;
