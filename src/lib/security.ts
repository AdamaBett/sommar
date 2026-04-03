/**
 * Security utilities: rate limiting, input sanitization, profanity filter.
 * Serverless-compatible (in-memory rate limit resets per cold start, which is fine for MSP).
 */

// ── Rate Limiting (in-memory, serverless-compatible) ────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
  /** Requests permitidos na janela */
  maxRequests: number;
  /** Janela em segundos */
  windowSeconds: number;
}

/** Rate limit presets por tipo de endpoint */
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  matter: { maxRequests: 30, windowSeconds: 60 },
  extraction: { maxRequests: 30, windowSeconds: 60 },
  safety: { maxRequests: 5, windowSeconds: 60 },
  organizer: { maxRequests: 20, windowSeconds: 60 },
  auth: { maxRequests: 10, windowSeconds: 60 },
};

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/** Verifica rate limit para uma chave (ex: IP + endpoint) */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    // Nova janela
    const resetAt = now + config.windowSeconds * 1000;
    rateLimitStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt };
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt };
}

/** Extrai IP do request (compatível com Vercel) */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const real = request.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}

// ── Limpar store periodicamente (evitar memory leak) ───────────────

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    const entries = Array.from(rateLimitStore.entries());
    for (const [key, entry] of entries) {
      if (now > entry.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 60_000);
}

// ── Input Sanitization ──────────────────────────────────────────────

/** Remove HTML tags e scripts de texto de input */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URIs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: URIs
    .trim();
}

/** Valida e sanitiza slug de URL */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}

/** Valida UUID v4 */
export function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

// ── Profanity Filter (server-side) ──────────────────────────────────

const PROFANITY_PATTERNS = [
  // Ofensas graves em PT-BR (patterns parciais para cobrir variações)
  /\bput[ao]\b/i,
  /\bvadia\b/i,
  /\bv[iíi]ado\b/i,
  /\bsafad[ao]\b/i,
  /\bcrack[ue]r\b/i,
  /\bnig+[aer]/i,
  /\bfag+[oi]t/i,
  // Ameaças
  /\bvou te mat/i,
  /\bvou te bater/i,
  /\bvou te pegar/i,
  // Spam / phishing
  /\b(https?:\/\/\S+){3,}/i, // Muitos links
  /\b(bit\.ly|tinyurl|goo\.gl)\b/i,
];

interface ProfanityResult {
  flagged: boolean;
  reason?: string;
}

/** Filtra profanidade em texto de mensagem */
export function checkProfanity(text: string): ProfanityResult {
  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(text)) {
      return { flagged: true, reason: 'Conteúdo inadequado detectado' };
    }
  }
  return { flagged: false };
}
