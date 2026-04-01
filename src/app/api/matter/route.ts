import { chatWithMatter, type MatterMessage } from '@/lib/ai/matter';
import { MATTER_SYSTEM_PROMPT } from '@/lib/ai/prompts/matter-system';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { messages, context } = (await request.json()) as {
      messages: MatterMessage[];
      context?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Mensagens sao obrigatorias' },
        { status: 400 }
      );
    }

    const systemPrompt = context
      ? `${MATTER_SYSTEM_PROMPT}\n\nContexto adicional:\n${context}`
      : MATTER_SYSTEM_PROMPT;

    const response = await chatWithMatter(messages, systemPrompt);

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('Matter API error:', error);
    return NextResponse.json(
      { error: 'Erro ao comunicar com a Matter' },
      { status: 500 }
    );
  }
}
