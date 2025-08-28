'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChat } from '@hashbrownai/react';
import { useUser } from '@clerk/nextjs';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatProps {
  title?: string;
  placeholder?: string;
  className?: string;
  onSendMessage?: (message: string) => void;
  initialMessages?: Message[];
}

const breakfastLoadingMessages = [
  '🥓 The bacon is sizzling...',
  '🥞 Flipping pancakes...',
  '☕ Brewing the perfect cup...',
  '🧈 Buttering the toast...',
  '🥚 Scrambling some thoughts...',
  '🥄 Whisking up a response...',
  '🧇 The waffle iron is heating up...',
  '🍯 Pouring the syrup...',
  '🥚 Cracking eggs of wisdom...',
  '🍞 Toasting the perfect reply...',
];

export function Chat({
  title = 'Chat',
  placeholder = 'Type your message...',
  className,
  onSendMessage,
  initialMessages = [],
}: ChatProps) {
  const [userMessage, setUserMessage] = useState('');
  const { user } = useUser();
  console.log('🚀 ~ Chat ~ user:', user);

  const [loadingMessage, setLoadingMessage] = useState(
    () =>
      breakfastLoadingMessages[
        Math.floor(Math.random() * breakfastLoadingMessages.length)
      ]
  );
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, sendMessage, isReceiving, isSending } = useChat({
    model: 'gpt-4',
    system: 'hashbrowns should be covered and smothered',
    messages: [
      { role: 'user', content: 'Write a short story about breakfast.' },
    ],
  });

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (userMessage.trim()) {
      // Pick a new random loading message for this request
      const newLoadingMessage =
        breakfastLoadingMessages[
          Math.floor(Math.random() * breakfastLoadingMessages.length)
        ];
      setLoadingMessage(newLoadingMessage);

      sendMessage({ role: 'user', content: userMessage });
      setUserMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card
      className={cn(
        'w-full max-w-2xl mx-auto h-[600px] flex flex-col',
        className
      )}
    >
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full px-4">
          <div className="space-y-4 py-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start a conversation!</p>
              </div>
            ) : (
              messages.map((message, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex gap-3 max-w-[80%]',
                    message.role === 'user' ? 'ml-auto' : 'mr-auto'
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={`/bot-avatar.png`} />
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      'rounded-lg px-3 py-2 text-sm',
                      message.role === 'user'
                        ? 'background-latte text-foreground-base ml-auto'
                        : 'background-oats'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {/* <span
                      className={cn(
                        'text-xs opacity-70 mt-1 block',
                        message.role === 'user'
                          ? 'text-foreground-dark/70'
                          : 'text-foreground-base'
                      )}
                    >
                      {formatTime(message.timestamp)}
                    </span> */}
                  </div>

                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={user?.imageUrl || `/user-avatar.png`} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}

            {isSending && (
              <div className="flex gap-3 max-w-[80%] mr-auto">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="background-oats rounded-lg px-3 py-2 text-sm">
                  <div className="flex gap-1">
                    <span>{loadingMessage}</span>
                    <div className="w-2 h-2 background-muted-foreground/50 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 background-muted-foreground/50 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 background-muted-foreground/50 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex-shrink-0 p-4">
        <div className="flex w-full gap-2">
          <Input
            ref={inputRef}
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isReceiving || isSending}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!userMessage.trim() || isReceiving || isSending}
            size="icon"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default Chat;
