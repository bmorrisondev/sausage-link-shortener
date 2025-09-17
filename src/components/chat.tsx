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
import { exposeComponent, useTool, useUiChat } from '@hashbrownai/react';
import { useUser } from '@clerk/nextjs';
import { s } from '@hashbrownai/core';
import MarkdownWrapper from './markdown-wrapper';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import QRCode from 'qrcode';
import LinkQueryList from './link-query-list';
import ShortLinkQuery from './short-link';
import BaconDivider from './bacon-divider';

import LinkGraph from './link-graph';
import LinksGraphSearch from './links-graph-search';

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
  const base = process.env.NEXT_PUBLIC_REDIRECT_BASE_URL;

  const [userMessage, setUserMessage] = useState('');
  const { user } = useUser();

  const [loadingMessage, setLoadingMessage] = useState(
    () =>
      breakfastLoadingMessages[
        Math.floor(Math.random() * breakfastLoadingMessages.length)
      ]
  );
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const insertLinkMutation = useMutation(api.links.insert);
  const updateLinkMutation = useMutation(api.links.updateLink);

  const { messages, sendMessage, isReceiving, isSending } = useUiChat({
    debugName: 'Chat Component',
    model: 'gpt-4.1',
    system:
      'You are a helpful assistant that helps users create short links. When a user provides a URL, create a short link for it using the create_short_link tool. You can also show existing links, and statistics about links. Always respond in markdown format. If a user asks for statistics about a link, show a graph of link clicks over time.',
    messages: [
      { role: 'user', content: 'Write a short story about breakfast.' },
    ],
    tools: [
      useTool({
        name: 'create_short_link',
        description: 'Create a short link for a given URL',
        schema: s.object('Data for a short link', {
          url: s.string('The URL to shorten'),
          description: s.string('Description of the link'),
        }),
        handler: async (input) => {
          const createdLink = await insertLinkMutation({
            destination: input.url,
            description: input.description || 'A short link',
          });

          const href = `${base}/l/${createdLink.slug}`;
          const qrCode = await QRCode.toDataURL(href);
          console.log(qrCode);

          await updateLinkMutation({
            linkId: createdLink.id,
            qr_code: qrCode,
          });
          console.log(createdLink);
          return createdLink;
        },
        deps: [],
      }),
    ],
    components: [
      exposeComponent(ShortLinkQuery, {
        name: 'ShortLink',
        description:
          'Display a short link including its url, description, and slug',
        props: {
          id: s.string('The ID of the short link to display'),
        },
      }),
      exposeComponent(MarkdownWrapper, {
        name: 'MarkdownWrapper',
        description: 'Show markdown to the user',
        props: {
          content: s.streaming.string('The markdown content'),
        },
      }),
      exposeComponent(LinkQueryList, {
        name: 'LinkQueryList',
        description: 'Show a list of links matching a query',
        props: {
          query: s.string('The search term to filter links by'),
        },
      }),
      exposeComponent(LinksGraphSearch, {
        name: 'LinksGraphSearch',
        description:
          'Search for links and display the analytics associated with each one',
        props: {
          query: s.string('The search term to filter links by'),
        },
      }),
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

  return (
    <Card
      className={cn(
        'w-full max-w-4xl mx-auto h-[80vh] flex flex-col bg-white',
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
                    <>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={`/bot-avatar.png`} />
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      {message.toolCalls?.length === 0 && (
                        <div
                          className={cn(
                            'rounded-lg px-3 py-2 text-sm background-oats'
                          )}
                        >
                          {message.ui}
                        </div>
                      )}
                      {message.toolCalls?.length > 0 &&
                        message.toolCalls.map((toolCall, index) => (
                          <div
                            key={index}
                            className={cn(
                              'rounded-lg px-3 py-2 text-sm background-oats'
                            )}
                          >
                            {toolCall.status === 'pending'
                              ? 'Calling...'
                              : 'Called'}{' '}
                            tool: {toolCall.name}
                          </div>
                        ))}
                    </>
                  )}

                  {message.role === 'user' && (
                    <>
                      <div
                        className={cn(
                          'ml-auto rounded-lg px-3 py-2 text-sm background-oats'
                        )}
                      >
                        <p className="whitespace-pre-wrap bg-background-toast px-4 py-2 rounded-lg">
                          {message.content as string}
                        </p>
                      </div>
                      <Avatar className="h-8 w-8 flex-shrink-0 mt-2">
                        <AvatarImage
                          src={user?.imageUrl || `/user-avatar.png`}
                        />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </>
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
