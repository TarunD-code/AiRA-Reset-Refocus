import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import dotenv from 'dotenv';
import { isTurn, turnSchema, type RequestData, type Turn } from '../shared/contracts.js';
import { PublicError } from './provider.js';

dotenv.config();

export function getGeminiApiKey(): string | undefined {
  return process.env.GEMINI_API_KEY;
}

export type GeminiConfig = { key: string; model: string };

const OPENUI_SYSTEM_INSTRUCTION = `You are AiRA, an elite ergonomics and mobility wellness coach.
You MUST respond strictly with a single JSON object containing a "reply" key: {"reply": "\`\`\`openui\\n...\`\`\`"}.

Inside the "reply" string, you MUST format your output as an OpenUI code block starting with \`\`\`openui and ending with \`\`\`.

STRICT RULES FOR OPENUI PROGRAM OUTPUT:
1. Root statement MUST be: root = Screens([screen1, screen2, ...])
2. Each Screen MUST be: screen1 = Screen([component1, component2, ...])
3. ONLY use the following allowed OpenUI statements (DO NOT use standard HTML or unlisted functions):
   - Screens(screens, cursor?)
   - Screen(children, seen?)
   - Text(text, variant?, color?) - variant must be one of: 'title', 'subtitle', 'description', 'body'. color must be hex format like '#ffffff'.
   - Keyword(text, caption?, color?)
   - List(items) - items MUST be a list of ListItem statements.
   - ListItem(text, marker?) - marker must be one of: 'bullet', 'numbered', 'plus', 'minus'.
   - Alert(tone, text) - tone must be one of: 'info', 'warning', 'danger'.
   - Timer(label, seconds) - seconds MUST be an integer > 0.
   - Cue(text)
   - FollowUps(prompts) - prompts MUST be an array of strings.
   - PostureFocus(posture, colorTone?) - posture must be one of: 'seated', 'standing'.
   - BreathingPacer(label, seconds)
   - ThemeToggle(mode?) - mode must be 'light' or 'dark'.
   - AudioCoachToggle()
   - EnergyMeter()
   - CalendarBanner()
   - LungCapacityGame()
   - NeckRollGuide()
   - StandingGuide()
   - ShoulderShrugGuide()
   - TorsoTwistGuide()
   - PelvicTiltGuide()
   - KneeChestGuide()
   - LegExtensionGuide()
   - FigureFourGuide()
   - HeelToeGuide()
   - HandWristGuide()
   - SeatedMarchGuide()
   - TricepsLatGuide()
   - RhomboidPressGuide()
   - OverheadSideBendGuide()
   - AnklePumpGuide()
   - AnkleCircleGuide()
   - ToeTapGuide()
   - DeskPushUpGuide()
   - ChairSquatGuide()

4. DO NOT output standard HTML tags like <div>, <p>, <span>, or <img>.
5. All statement names must match exact casing. Never reference undefined variable identifiers.
`;

function isTransientError(error: unknown): boolean {
  if (error instanceof PublicError) {
    return error.code === 'PROVIDER' || error.code === 'NETWORK' || error.status === 503 || error.status === 429 || error.status >= 500;
  }
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('500') ||
    msg.includes('502') ||
    msg.includes('504') ||
    msg.includes('Service Unavailable') ||
    msg.includes('Too Many Requests') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('overloaded') ||
    msg.includes('high demand') ||
    msg.includes('temporarily unavailable')
  );
}

async function execTurnForModel(
  modelName: string,
  request: RequestData,
  skill: string,
  apiKey: string,
  signal: AbortSignal,
  transport: typeof fetch
): Promise<Turn> {
  const fullSystemInstruction = `${OPENUI_SYSTEM_INSTRUCTION}\n\n${skill}`;

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
      systemInstruction: { parts: [{ text: fullSystemInstruction }] },
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
        : response.status === 429 || response.status === 503
        ? `Gemini API returned status ${response.status}.`
        : 'The Gemini request failed. Check model access and local configuration.';
      throw new PublicError('PROVIDER', message, response.status);
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
    return parsed;
  }

  try {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({
      model: modelName,
      systemInstruction: fullSystemInstruction,
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

    return parsed;
  } catch (error) {
    if (error instanceof PublicError) throw error;
    if (signal.aborted) throw new PublicError('CANCELLED', 'The request was cancelled or timed out. Retry if needed.', 408);
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('401') || msg.includes('403') || msg.includes('API key') || msg.includes('API_KEY_INVALID')) {
      throw new PublicError('PROVIDER', 'The Gemini API key was rejected. Check the local .env file.', 401);
    }
    if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
      throw new PublicError('PROVIDER', 'Gemini rate or quota limit was reached. Check your account before retrying.', 429);
    }
    if (msg.includes('503') || msg.includes('Service Unavailable') || msg.includes('overloaded')) {
      throw new PublicError('PROVIDER', 'Gemini service unavailable (503).', 503);
    }
    throw new PublicError('PROVIDER', `Gemini request failed: ${msg}`);
  }
}

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

  const primaryModel = config.model || 'gemini-3.5-flash';
  const fallbacks = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
  const modelsToTry = [primaryModel, ...fallbacks.filter(m => m !== primaryModel)];

  let lastError: unknown;

  for (const modelName of modelsToTry) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      if (signal.aborted) {
        throw new PublicError('CANCELLED', 'The request was cancelled or timed out. Retry if needed.', 408);
      }
      try {
        const turn = await execTurnForModel(modelName, request, skill, apiKey, signal, transport);
        return { turn, returnedModel: modelName };
      } catch (err) {
        lastError = err;
        if (signal.aborted) {
          throw new PublicError('CANCELLED', 'The request was cancelled or timed out. Retry if needed.', 408);
        }
        if (!isTransientError(err)) {
          throw err;
        }
        if (attempt < 3) {
          const delayMs = 1000 * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
  }

  if (lastError instanceof PublicError) {
    throw lastError;
  }
  throw new PublicError(
    'PROVIDER',
    'Gemini service is currently unavailable due to high demand. Please try again in a few moments.'
  );
}
