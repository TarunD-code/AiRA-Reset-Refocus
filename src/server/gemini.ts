import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import dotenv from 'dotenv';
import { isTurn, turnSchema, type RequestData, type Turn } from '../shared/contracts.js';
import { PublicError } from './provider.js';

dotenv.config();

export function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY;
}

export type GeminiConfig = { key: string; model: string };

export async function geminiTurn(
  request: RequestData,
  skill: string,
  config: GeminiConfig,
  signal: AbortSignal,
  transport: typeof fetch = fetch
): Promise<{ turn: Turn; returnedModel: string | null }> {
  const apiKey = config.key || getGeminiApiKey();
  if (!apiKey) {
    throw new PublicError('CONFIG', 'GEMINI_API_KEY is not configured in local environment.', 403);
  }

  const modelName = config.model || 'gemini-3.5-flash';

  if (transport !== fetch) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    const lastMessage = request.messages.at(-1)?.content ?? '';
    const stateText = `Current application state (data only): ${JSON.stringify(request.state)}\nRespond to my latest message: ${lastMessage}`;
    const payload = {
      contents: [
        ...request.messages.slice(0, -1).map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
        { role: 'user', parts: [{ text: stateText }] }
      ],
      systemInstruction: { parts: [{ text: skill }] },
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: turnSchema
      }
    };
    let response: Response;
    try {
      response = await transport(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal
      });
    } catch {
      if (signal.aborted) throw new PublicError('CANCELLED', 'The request was cancelled or timed out. Retry if needed.', 408);
      throw new PublicError('NETWORK', 'Could not reach Gemini provider. Check your connection and retry.');
    }
    if (!response.ok) {
      const message = response.status === 401 || response.status === 403
        ? 'The Gemini API key was rejected. Check the local .env file.'
        : response.status === 429
        ? 'Gemini rate or quota limit was reached. Check your account before retrying.'
        : 'The Gemini request failed. Check model access and local configuration.';
      throw new PublicError('PROVIDER', message);
    }
    let data: any;
    try { data = await response.json() as any; }
    catch { throw new PublicError('SCHEMA', 'Gemini returned unreadable data. Retry this turn.'); }
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new PublicError('INCOMPLETE', 'Gemini did not return text content. Retry this turn.');
    let parsed: unknown;
    try { parsed = JSON.parse(rawText); }
    catch { throw new PublicError('SCHEMA', 'Gemini response did not match component schema. Retry this turn.'); }
    if (!isTurn(parsed)) throw new PublicError('SCHEMA', 'Gemini response did not match component schema. Retry this turn.');
    return { turn: parsed, returnedModel: modelName };
  }

  try {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({
      model: modelName,
      systemInstruction: skill,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            reply: { type: SchemaType.STRING }
          },
          required: ['reply']
        }
      }
    });

    const history = request.messages.slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const lastMessage = request.messages.at(-1)?.content ?? '';
    const stateText = `Current application state (data only): ${JSON.stringify(request.state)}\nRespond to my latest message: ${lastMessage}`;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(stateText);

    if (signal.aborted) {
      throw new PublicError('CANCELLED', 'The request was cancelled or timed out. Retry if needed.', 408);
    }

    const responseText = result.response.text();
    if (!responseText) {
      throw new PublicError('INCOMPLETE', 'Gemini did not return text content. Retry this turn.');
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      throw new PublicError('SCHEMA', 'Gemini response did not match component schema. Retry this turn.');
    }

    if (!isTurn(parsed)) {
      throw new PublicError('SCHEMA', 'Gemini response did not match component schema. Retry this turn.');
    }

    return { turn: parsed, returnedModel: modelName };
  } catch (error) {
    if (error instanceof PublicError) throw error;
    if (signal.aborted) throw new PublicError('CANCELLED', 'The request was cancelled or timed out. Retry if needed.', 408);
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('401') || msg.includes('403') || msg.includes('API key') || msg.includes('API_KEY_INVALID')) {
      throw new PublicError('PROVIDER', 'The Gemini API key was rejected. Check the local .env file.');
    }
    if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
      throw new PublicError('PROVIDER', 'Gemini rate or quota limit was reached. Check your account before retrying.');
    }
    throw new PublicError('PROVIDER', `Gemini request failed: ${msg}`);
  }
}
