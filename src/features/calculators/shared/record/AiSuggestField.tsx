'use client';

import React, { useState } from 'react';
import { Check, RefreshCw, Sparkles, X } from 'lucide-react';
import { suggestField, type SuggestField } from './aiSuggestions';
import type { SuggestContext } from './types';

interface AiSuggestFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  field: SuggestField;
  ctx: SuggestContext;
  placeholder?: string;
  rows?: number;
}

/**
 * Textové pole s AI asistentem. Tlačítko „Navrhnout s AI" vygeneruje kontextový
 * návrh (z dat kalkulačky), který lze vložit nebo přegenerovat.
 */
export function AiSuggestField({
  label,
  value,
  onChange,
  field,
  ctx,
  placeholder,
  rows = 3,
}: AiSuggestFieldProps) {
  const [loading, setLoading] = useState(false);
  const [variant, setVariant] = useState(0);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const generate = (nextVariant: number) => {
    setLoading(true);
    setSuggestion(null);
    window.setTimeout(() => {
      setSuggestion(suggestField(field, ctx, nextVariant));
      setVariant(nextVariant);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <button
          type="button"
          onClick={() => generate(suggestion ? variant + 1 : variant)}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-600 px-2.5 py-1 text-xs font-medium text-brand-600 transition-colors hover:bg-brand-50 disabled:opacity-60"
        >
          <Sparkles className={`h-3.5 w-3.5 ${loading ? 'animate-pulse' : ''}`} />
          {loading ? 'Generuji…' : 'Navrhnout s AI'}
        </button>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground transition-colors placeholder:text-subtle hover:border-border-strong focus-visible:border-brand-500 focus-visible:shadow-focus"
      />

      {(loading || suggestion) && (
        <div className="mt-2 rounded-xl border border-brand-600/30 bg-brand-50 p-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            Návrh AI
            <span className="font-normal text-subtle">· zkontrolujte před vložením</span>
          </div>

          {loading ? (
            <div className="space-y-1.5">
              <div className="h-2.5 w-full animate-pulse rounded bg-brand-100" />
              <div className="h-2.5 w-4/5 animate-pulse rounded bg-brand-100" />
              <div className="h-2.5 w-2/3 animate-pulse rounded bg-brand-100" />
            </div>
          ) : (
            <>
              <p className="text-sm leading-relaxed text-foreground">{suggestion}</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (suggestion) onChange(suggestion);
                    setSuggestion(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-700"
                >
                  <Check className="h-3.5 w-3.5" />
                  Použít
                </button>
                <button
                  type="button"
                  onClick={() => generate(variant + 1)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-border-strong"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Jiný návrh
                </button>
                <button
                  type="button"
                  onClick={() => setSuggestion(null)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                  Zavřít
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
