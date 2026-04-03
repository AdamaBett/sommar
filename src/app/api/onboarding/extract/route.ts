import { NextRequest, NextResponse } from 'next/server';
import { extractFromConversation, type ConversationMessage, type ExtractionResult } from '@/lib/ai/extraction';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/security';

export const runtime = 'edge';

interface ExtractRequest {
  messages: ConversationMessage[];
  existing_data?: Partial<ExtractionResult>;
}

/** POST /api/onboarding/extract
 * Roda extração assíncrona com Haiku após cada mensagem do usuário.
 * Retorna dados estruturados extraídos da conversa.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Rate limiting
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(`extract:${ip}`, RATE_LIMITS.extraction);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Muitas requisições' },
        { status: 429 }
      );
    }

    const body = (await request.json()) as ExtractRequest;

    if (!body.messages || body.messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const result = await extractFromConversation(
      body.messages,
      body.existing_data ?? {}
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('[extraction] Error:', error);
    return NextResponse.json(
      { error: 'Extraction failed' },
      { status: 500 }
    );
  }
}
