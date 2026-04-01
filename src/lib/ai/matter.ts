import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface MatterMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Envia mensagens para a Matter e retorna resposta completa */
export async function chatWithMatter(
  messages: MatterMessage[],
  systemPrompt: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const textBlock = response.content.find(block => block.type === 'text');
  return textBlock?.text ?? '';
}

/** Stream de resposta da Matter, yield parcial a cada delta */
export async function* streamMatter(
  messages: MatterMessage[],
  systemPrompt: string
): AsyncGenerator<string> {
  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      yield event.delta.text;
    }
  }
}
