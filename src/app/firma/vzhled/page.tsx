'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Check, ImagePlus, RotateCcw, Upload } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAdminData } from '@/features/admin/AdminDataProvider';
import { useFirmaCompany } from '@/features/admin/FirmaCompanyProvider';
import { PageHeader } from '@/features/admin/components/primitives';
import { BRAND_PRESETS, applyBranding } from '@/features/admin/branding';

const DEFAULT_COLOR = '#A82844';

export default function FirmaBrandingPage() {
  const company = useFirmaCompany();
  const { saveCompany } = useAdminData();
  const fileRef = useRef<HTMLInputElement>(null);

  const [color, setColor] = useState(DEFAULT_COLOR);
  const [logoText, setLogoText] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    if (company) {
      setColor(company.brandColor || DEFAULT_COLOR);
      setLogoText(company.brandLogoText || '');
      setLogoUrl(company.brandLogoUrl || '');
    }
  }, [company]);

  // Živý náhled – průběžně aplikuj zvolenou barvu.
  useEffect(() => {
    applyBranding(color);
  }, [color]);

  if (!company) return <p className="text-sm text-muted">Firma nenalezena.</p>;

  const onUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const save = () =>
    saveCompany({ ...company, brandColor: color, brandLogoText: logoText, brandLogoUrl: logoUrl });

  const reset = () => {
    setColor(DEFAULT_COLOR);
    setLogoText('');
    setLogoUrl('');
    saveCompany({ ...company, brandColor: '', brandLogoText: '', brandLogoUrl: '' });
  };

  return (
    <div>
      <PageHeader
        title="Vzhled"
        description="Nastavte si vlastní logo a barvy. Změny se projeví ve vaší administraci a u sjednání."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Nastavení */}
        <div className="space-y-6">
          {/* Barva */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">Hlavní barva</h2>
            <div className="mt-4 flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-11 w-14 cursor-pointer rounded-lg border border-border bg-surface"
              />
              <Input value={color} onChange={(e) => setColor(e.target.value)} className="max-w-[140px]" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {BRAND_PRESETS.map((p) => (
                <button
                  key={p.hex}
                  type="button"
                  onClick={() => setColor(p.hex)}
                  className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-border-strong"
                >
                  <span className="h-4 w-4 rounded-full" style={{ backgroundColor: p.hex }} />
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Logo */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">Logo</h2>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <Input
                label="Iniciály / krátký text loga"
                placeholder="FR"
                value={logoText}
                onChange={(e) => setLogoText(e.target.value.slice(0, 3))}
                hint="Zobrazí se, pokud nenahrajete obrázek."
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Obrázek loga</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                />
                <div className="flex items-center gap-3">
                  <Button variant="secondary" onClick={() => fileRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Nahrát logo
                  </Button>
                  {logoUrl && (
                    <button type="button" onClick={() => setLogoUrl('')} className="text-sm font-medium text-muted hover:text-foreground">
                      Odebrat
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={save}>
              <Check className="mr-2 h-4 w-4" />
              Uložit vzhled
            </Button>
            <Button variant="secondary" onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Obnovit výchozí
            </Button>
          </div>
        </div>

        {/* Náhled */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-foreground">Náhled</h2>
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            {/* Hlavička s logem */}
            <div className="flex items-center gap-3 border-b border-border pb-4">
              {logoUrl ? (
                <img src={logoUrl} alt="logo" className="h-10 w-10 rounded-lg object-contain" />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                  {logoText || <ImagePlus className="h-5 w-5" />}
                </span>
              )}
              <div className="text-sm font-semibold text-foreground">{company.name}</div>
            </div>

            {/* Ukázkové prvky */}
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-brand-600 bg-brand-50 p-4">
                <div className="text-sm font-semibold text-brand-700">Vybraná nabídka</div>
                <div className="mt-1 text-sm text-muted">Takto budou vypadat zvýrazněné karty a stavy.</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button>Primární tlačítko</Button>
                <Button variant="secondary">Sekundární</Button>
                <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                  Odznak
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-brand-600 to-brand-400" />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted">
            Barva se generuje do celé palety automaticky. Náhled je živý — uložením se nastaví napevno.
          </p>
        </div>
      </div>
    </div>
  );
}
