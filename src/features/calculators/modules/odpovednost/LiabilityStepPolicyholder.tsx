'use client';

import React from 'react';
import { Calendar, PlusCircle, Shield, Wallet } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { ADDONS, LIMITS, computeTotalPrice, formatCzk } from './data';
import type { PolicyholderState } from './data';
import { AddressFields, Checkbox } from './components/FormFields';

interface LiabilityStepPolicyholderProps {
  limit: string;
  added: Record<string, boolean>;
  value: PolicyholderState;
  onChange: (next: PolicyholderState) => void;
  onBack: () => void;
  onEdit: () => void;
  onNext: () => void;
}

export function LiabilityStepPolicyholder({
  limit,
  added,
  value,
  onChange,
  onBack,
  onEdit,
  onNext,
}: LiabilityStepPolicyholderProps) {
  const limitOption = LIMITS.find((l) => l.value === limit);
  const addedAddons = ADDONS.filter((a) => added[a.id]);
  const totalPrice = computeTotalPrice(limit, added);

  const set = <K extends keyof PolicyholderState>(key: K, v: PolicyholderState[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="space-y-6">
      {/* Souhrn zadání z kroku 1 */}
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          <div className="rounded-xl border border-border bg-surface p-4 shadow-sm md:p-5">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-600" />
              <h3 className="text-sm font-semibold text-foreground">Rozsah pojištění</h3>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">
                Limit {limitOption?.label ?? '—'}
              </div>
              {limitOption?.desc && <div className="text-xs text-muted">{limitOption.desc}</div>}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 shadow-sm md:p-5">
            <div className="mb-3 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-brand-600" />
              <h3 className="text-sm font-semibold text-foreground">Připojištění</h3>
            </div>
            <div className="space-y-2">
              {addedAddons.length === 0 ? (
                <div className="text-sm text-muted">Žádné připojištění</div>
              ) : (
                <div className="text-sm text-foreground">
                  {addedAddons.map((a) => a.title).join(', ')}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 shadow-sm md:p-5">
            <div className="mb-3 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-brand-600" />
              <h3 className="text-sm font-semibold text-foreground">Roční pojistné</h3>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-foreground">{formatCzk(totalPrice)}</div>
              <div className="text-xs text-muted">/ rok</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-brand-600 px-4 py-2.5 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50"
          >
            Upravit zadání
          </button>
        </div>
      </div>

      {/* Počátek pojištění */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Počátek pojištění</h2>
        <div className="mt-4 max-w-xs">
          <Input
            type="date"
            value={value.startDate}
            onChange={(e) => set('startDate', e.target.value)}
            rightElement={<Calendar className="h-4 w-4 text-brand-600" />}
          />
        </div>
      </div>

      {/* Pojištěný + místo pojištění vedle sebe */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Údaje o pojištěném */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Údaje o pojištěném</h2>
          <div className="mt-4 space-y-4">
            <Input
              label="Jméno"
              placeholder="Jiří"
              value={value.firstName}
              onChange={(e) => set('firstName', e.target.value)}
            />
            <Input
              label="Příjmení"
              placeholder="Hluchý"
              value={value.lastName}
              onChange={(e) => set('lastName', e.target.value)}
            />
            {value.isForeigner ? (
              <Input
                label="Datum narození"
                type="date"
                value={value.birthDate}
                onChange={(e) => set('birthDate', e.target.value)}
              />
            ) : (
              <Input
                label="Rodné číslo"
                placeholder="000000/0000"
                value={value.birthNumber}
                onChange={(e) => set('birthNumber', e.target.value)}
              />
            )}
            <Checkbox
              checked={value.isForeigner}
              onChange={(v) => set('isForeigner', v)}
              label="Nemám rodné číslo (jsem cizinec)."
            />
            <Input
              label="Kontaktní telefon"
              type="tel"
              placeholder="+420 777 055 525"
              value={value.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
            <Input
              label="E-mail"
              type="email"
              placeholder="hello@email.cz"
              value={value.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </div>
        </div>

        {/* Místo pojištění */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Místo pojištění</h2>
          <div className="mt-4">
            <AddressFields value={value.insuredAddress} onChange={(a) => set('insuredAddress', a)} />
          </div>
          <div className="mt-5 space-y-3">
            <Checkbox
              checked={value.livesHere}
              onChange={(v) => set('livesHere', v)}
              label="Na výše uvedené adrese bydlím."
            />
            <Checkbox
              checked={value.ownsProperty}
              onChange={(v) => set('ownsProperty', v)}
              label="Tato nemovitost je v mém vlastnictví či spoluvlastnictví."
            />
          </div>
        </div>
      </div>

      {/* Údaje do smlouvy */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Zadejte potřebné údaje do smlouvy</h2>

        <div className="mt-4 space-y-3">
          <Checkbox
            checked={value.differentPermanent}
            onChange={(v) => set('differentPermanent', v)}
            label="Moje trvalá adresa se liší od místa pojištění."
            info
          />
          {value.differentPermanent && (
            <div className="rounded-xl border border-border bg-surface-muted p-5">
              <h3 className="mb-4 text-base font-semibold text-foreground">Trvalé bydliště</h3>
              <AddressFields
                value={value.permanentAddress}
                onChange={(a) => set('permanentAddress', a)}
              />
            </div>
          )}

          <Checkbox
            checked={value.differentMailing}
            onChange={(v) => set('differentMailing', v)}
            label="Chci zadat jinou korespondenční adresu."
          />
          {value.differentMailing && (
            <div className="rounded-xl border border-border bg-surface-muted p-5">
              <h3 className="mb-4 text-base font-semibold text-foreground">Korespondenční adresa</h3>
              <AddressFields value={value.mailingAddress} onChange={(a) => set('mailingAddress', a)} />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Zpět
        </Button>
        <Button onClick={onNext}>Pokračovat na záznam</Button>
      </div>
    </div>
  );
}

export default LiabilityStepPolicyholder;
