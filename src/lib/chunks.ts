'use server';
import { createContextualChunkPrompt } from './prompt';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// You can use other Providers like OpenAI, Anthropic.
// Read more: https://sdk.vercel.ai/providers/ai-sdk-providers

export async function createContextualPrompts(document: string, chunks: string[]) {
  const prompts = [];
  for (const chunk of chunks) {
    prompts.push(createContextualChunkPrompt(document, chunk));
  }
  return prompts;
}

// Generate contextual chunks
export async function generateContextualChunks(prompts: string[]) {
  try {
    // generate only 5 chunks
    const testPrompts = prompts.slice(0, 5);

    const contextualChunks = [];

    for (const prompt of testPrompts) {
      const { object } = await generateObject({
        model: google('gemini-1.5-flash-002'),
        prompt: prompt,
        schema: z.object({
          chunk: z.string(),
        }),
      });
      contextualChunks.push(object.chunk);
    }
    return contextualChunks;
  } catch (error) {
    console.error('Error generating contextual chunks:', error);
    return [];
  }
}
