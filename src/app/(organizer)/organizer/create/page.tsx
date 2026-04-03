'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { OrganizerHeader } from '@/components/organizer/OrganizerHeader';
import { cn } from '@/lib/utils';

interface EventFormData {
  name: string;
  slug: string;
  description: string;
  matter_context: string;
  start_time: string;
  end_time: string;
  location_name: string;
  ticket_url: string;
  expected_capacity: string;
  tags: string;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function CreateEventPage(): JSX.Element {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<EventFormData>({
    name: '',
    slug: '',
    description: '',
    matter_context: '',
    start_time: '',
    end_time: '',
    location_name: '',
    ticket_url: '',
    expected_capacity: '',
    tags: '',
  });

  const updateField = useCallback((field: keyof EventFormData, value: string) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-gerar slug a partir do nome
      if (field === 'name') {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/organizer/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          expected_capacity: form.expected_capacity ? parseInt(form.expected_capacity, 10) : null,
          tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        }),
      });

      if (response.ok) {
        router.push('/organizer');
      }
    } catch {
      console.error('Erro ao criar evento');
    } finally {
      setIsSubmitting(false);
    }
  }, [form, router]);

  return (
    <div className="min-h-screen">
      <OrganizerHeader />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="font-display text-2xl text-white mb-2">Criar novo evento</h2>
        <p className="text-sm text-white/50 mb-8">
          Preencha as informações do seu evento. O campo de contexto para a Matter e o mais importante.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <FormField label="Nome do evento" required>
            <input
              type="text"
              value={form.name}
              onChange={e => updateField('name', e.target.value)}
              placeholder="Ex: Festival de Verão 2026"
              required
              className={inputClass}
            />
          </FormField>

          {/* Slug */}
          <FormField label="URL do evento" hint={`sommar.app/e/${form.slug || '...'}`}>
            <input
              type="text"
              value={form.slug}
              onChange={e => updateField('slug', e.target.value)}
              placeholder="festival-verao-2026"
              required
              className={inputClass}
            />
          </FormField>

          {/* Descrição */}
          <FormField label="Descrição" hint="Texto público na página do evento">
            <textarea
              value={form.description}
              onChange={e => updateField('description', e.target.value)}
              placeholder="Descreva o evento para quem vai ver a página pública..."
              rows={3}
              className={cn(inputClass, 'resize-none')}
            />
          </FormField>

          {/* Matter Context */}
          <FormField
            label="Contexto para a Matter"
            hint="FUNDAMENTAL. A Matter usa isso para adaptar o onboarding e matching ao contexto do seu evento."
            required
          >
            <textarea
              value={form.matter_context}
              onChange={e => updateField('matter_context', e.target.value)}
              placeholder="Ex: Festival de música ao vivo em espaço aberto. Jazz, eletrônica, soul. 300-500 pessoas. Público jovem adulto, 25-40 anos. Foco em networking cultural."
              rows={4}
              required
              className={cn(inputClass, 'resize-none')}
            />
            <p className="text-xs text-[var(--amber-glow)]/70 mt-2">
              Quanto mais detalhado, melhor a Matter entende o contexto e faz matches relevantes.
            </p>
          </FormField>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Início" required>
              <input
                type="datetime-local"
                value={form.start_time}
                onChange={e => updateField('start_time', e.target.value)}
                required
                className={inputClass}
              />
            </FormField>
            <FormField label="Fim">
              <input
                type="datetime-local"
                value={form.end_time}
                onChange={e => updateField('end_time', e.target.value)}
                className={inputClass}
              />
            </FormField>
          </div>

          {/* Local */}
          <FormField label="Local" hint="Nome do local, nunca GPS automático">
            <input
              type="text"
              value={form.location_name}
              onChange={e => updateField('location_name', e.target.value)}
              placeholder="Ex: Praça XV, Florianópolis"
              className={inputClass}
            />
          </FormField>

          {/* Link de ingressos */}
          <FormField label="Link para ingressos" hint="Opcional. Link externo de venda">
            <input
              type="url"
              value={form.ticket_url}
              onChange={e => updateField('ticket_url', e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </FormField>

          {/* Capacidade */}
          <FormField label="Capacidade esperada">
            <input
              type="number"
              value={form.expected_capacity}
              onChange={e => updateField('expected_capacity', e.target.value)}
              placeholder="200"
              min={1}
              className={inputClass}
            />
          </FormField>

          {/* Tags */}
          <FormField label="Tags" hint="Separadas por vírgula">
            <input
              type="text"
              value={form.tags}
              onChange={e => updateField('tags', e.target.value)}
              placeholder="música, networking, tecnologia"
              className={inputClass}
            />
          </FormField>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !form.name || !form.matter_context || !form.start_time}
              className={cn(
                'flex-1 px-6 py-3 rounded-xl text-sm font-medium',
                'bg-[var(--green)] text-black',
                'hover:bg-[var(--green-glow)] hover:shadow-[0_0_20px_rgba(29,255,168,0.3)]',
                'disabled:opacity-40 disabled:cursor-not-allowed',
                'transition-all duration-200'
              )}
            >
              {isSubmitting ? 'Criando...' : 'Criar evento'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl text-sm text-white/50 hover:text-white/70 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

// ── Componentes auxiliares ─────────────────────────────
const inputClass = cn(
  'w-full px-4 py-3 rounded-xl text-sm text-white',
  'bg-white/[0.03] border border-white/[0.06]',
  'placeholder:text-white/25',
  'outline-none transition-all duration-200',
  'focus:border-[var(--green)]/50 focus:bg-white/[0.05]',
  'focus:shadow-[0_0_0_2px_rgba(29,158,117,0.1)]',
  'backdrop-blur-sm'
);

interface FormFieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({ label, hint, required, children }: FormFieldProps): JSX.Element {
  return (
    <div>
      <label className="block text-sm font-medium text-white/80 mb-1.5">
        {label}
        {required && <span className="text-[var(--coral)] ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-white/30 mt-1.5">{hint}</p>}
    </div>
  );
}
