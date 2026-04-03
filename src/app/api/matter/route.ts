import { type MatterMessage } from '@/lib/ai/matter';
import { MATTER_SYSTEM_PROMPT } from '@/lib/ai/prompts/matter-system';
import { checkRateLimit, getClientIP, sanitizeInput, RATE_LIMITS } from '@/lib/security';
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'edge';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface MatterRequest {
  messages: MatterMessage[];
  context?: string;
  stream?: boolean;
}

/** POST /api/matter — Chat com a Matter (streaming ou completo) */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Rate limiting
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(`matter:${ip}`, RATE_LIMITS.matter);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Muitas requisições. Tente novamente em instantes.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = (await request.json()) as MatterRequest;

    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: 'Mensagens são obrigatórias' },
        { status: 400 }
      );
    }

    // Input validation e sanitização
    for (const msg of body.messages) {
      if (typeof msg.content !== 'string' || msg.content.length > 5000) {
        return NextResponse.json(
          { error: 'Mensagem inválida ou muito longa (max 5000 caracteres)' },
          { status: 400 }
        );
      }
      if (msg.role !== 'user' && msg.role !== 'assistant') {
        return NextResponse.json(
          { error: 'Role inválido' },
          { status: 400 }
        );
      }
      // Sanitizar input do usuário (remover HTML, scripts)
      if (msg.role === 'user') {
        msg.content = sanitizeInput(msg.content);
      }
    }

    // Limitar histórico a 40 mensagens para controle de custo
    const trimmedMessages = body.messages.slice(-40);

    const systemPrompt = body.context
      ? `${MATTER_SYSTEM_PROMPT}\n\nContexto adicional:\n${body.context}`
      : MATTER_SYSTEM_PROMPT;

    if (body.stream) {
      // Streaming via SSE
      const stream = anthropic.messages.stream({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: trimmedMessages,
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const event of stream) {
              if (
                event.type === 'content_block_delta' &&
                event.delta.type === 'text_delta'
              ) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
                );
              }
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`)
            );
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // Resposta completa (non-streaming)
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: trimmedMessages,
    });

    const textBlock = response.content.find(block => block.type === 'text');
    return NextResponse.json({ message: textBlock?.text ?? '' });
  } catch (error) {
    console.error('[matter] API error:', error);
    return NextResponse.json(
      { error: 'Erro ao comunicar com a Matter' },
      { status: 500 }
    );
  }
}
