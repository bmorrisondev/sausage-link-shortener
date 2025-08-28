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

export function Chat({
  title = 'Chat',
  placeholder = 'Type your message...',
  className,
  onSendMessage,
  initialMessages = [],
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    // Call the optional onSendMessage callback
    if (onSendMessage) {
      onSendMessage(inputValue.trim());
    }

    // Simulate bot response (you can replace this with actual API call)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I received your message: "${newMessage.content}". This is a demo response!`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
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
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3 max-w-[80%]',
                    message.sender === 'user' ? 'ml-auto' : 'mr-auto'
                  )}
                >
                  {message.sender === 'bot' && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src="/bot-avatar.png" />
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      'rounded-lg px-3 py-2 text-sm',
                      message.sender === 'user'
                        ? 'background-latte text-foreground-base ml-auto'
                        : 'background-oats'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <span
                      className={cn(
                        'text-xs opacity-70 mt-1 block',
                        message.sender === 'user'
                          ? 'text-foreground-dark/70'
                          : 'text-foreground-base'
                      )}
                    >
                      {formatTime(message.timestamp)}
                    </span>
                  </div>

                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src="/user-avatar.png" />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-3 max-w-[80%] mr-auto">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="background-oats rounded-lg px-3 py-2 text-sm">
                  <div className="flex gap-1">
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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
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
