import { NextRequest } from 'next/server';
import { HashbrownOpenAI } from '@hashbrownai/openai';
import { Chat } from '@hashbrownai/core';
import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
export const runtime = 'nodejs'; // ensure Node runtime (not edge)

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  const user = await (await clerkClient()).users.getUser(userId)
  const apiKey = user.privateMetadata?.openai_api_key

  if(!apiKey) {
    return new Response('No API key found', {
      status: 401,
    })
  }

  const body: Chat.Api.CompletionCreateParams = await req.json();

  const stream = HashbrownOpenAI.stream.text({
    apiKey: apiKey as string,
    request: body,
  });

  // Transform the stream into a Web standard ReadableStream
  const transformStream = new TransformStream();
  const writer = transformStream.writable.getWriter();

  // Process the stream in the background
  (async () => {
    try {
      for await (const chunk of stream) {
        await writer.write(chunk);
      }
    } catch (error) {
      console.error('Stream error:', error);
    } finally {
      await writer.close();
    }
  })();

  // Return the stream as a response
  return new Response(transformStream.readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
