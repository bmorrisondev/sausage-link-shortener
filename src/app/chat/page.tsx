'use client';

import React, { useEffect, useState } from 'react';
import Chat from '@/components/chat';
import { HashbrownProvider } from '@hashbrownai/react';
import { useAuth } from '@clerk/nextjs'
import { hasKeySet, setKey } from './actions'

function ApiKeyForm() {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await setKey(apiKey.trim());
      window.location.reload(); // Reload to check if key is set
    } catch (err) {
      setError('Failed to save API key. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="container mx-auto max-w-md py-12 px-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Set Your OpenAI API Key</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="apiKey" className="block text-sm font-medium mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="sk-..."
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save API Key'}
          </button>
        </form>
        
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Your API key is stored securely in your user metadata and is never shared.
        </p>
      </div>
    </div>
  );
}

function ChatPage() {
  const { isLoaded } = useAuth()
  const [hasKey, setHasKey] = useState<boolean | null>(null)

  useEffect(() => {
    async function init() {
      const hasKey = await hasKeySet()
      setHasKey(hasKey)
    }
    init()
  }, [])

  if (!isLoaded || hasKey === null) {
    return <div>Loading...</div>
  }

  if (!hasKey) {
    return <ApiKeyForm />
  }

  return (
    <HashbrownProvider url={'/api/chat'}>
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
    </HashbrownProvider>
  );
}

export default ChatPage;
