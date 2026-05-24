'use client';

import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, FolderPlus, Plus } from 'lucide-react';
import { Badge, Button, Input, Modal } from '@/components/ui';
import { useAdminData } from '@/features/admin/AdminDataProvider';
import {
  ConfirmDialog,
  PageHeader,
  RowActions,
  SearchInput,
  StatusPill,
} from '@/features/admin/components/primitives';
import { FormModal, type Field } from '@/features/admin/components/FormModal';
import type { Product } from '@/features/admin/types';

function emptyProduct(insurerId: string, category: string): Product {
  return {
    id: '',
    insurerId,
    category,
    name: '',
    internalCode: '',
    externalCode: '',
    type: 'podnikatele',
    status: 'aktivni',
    calculatorEnabled: false,
    url: '',
    sjednani: ['online'],
  };
}

const fields: Field<Product>[] = [
  { key: 'name', label: 'Název produktu', full: true },
  { key: 'category', label: 'Produktová oblast' },
  { key: 'externalCode', label: 'Kód pojišťovny pro sjednání', placeholder: 'např. 7710 / MAX' },
  { key: 'internalCode', label: 'Interní kód' },
  { key: 'url', label: 'URL / integrace', full: true },
  {
    key: 'sjednani',
    label: 'Podporované typy sjednání',
    type: 'multiselect',
    full: true,
    options: [
      { value: 'online', label: 'Online' },
      { value: 'podpis', label: 'Podpisem' },
      { value: 'na-dalku', label: 'Na dálku' },
    ],
  },
  { key: 'calculatorEnabled', label: 'Dostupné v kalkulačce' },
  {
    key: 'status',
    label: 'Stav',
    type: 'select',
    options: [
      { value: 'aktivni', label: 'Aktivní' },
      { value: 'neaktivni', label: 'Neaktivní' },
    ],
  },
];

export default function ProductsPage() {
  const { insurers, products, extraCategories, addCategory, saveProduct, removeProduct } = useAdminData();
  const [query, setQuery] = useState('');
  const [openInsurer, setOpenInsurer] = useState<Record<string, boolean>>({});
  const [openCat, setOpenCat] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<Product | null>(null);
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [newCatFor, setNewCatFor] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState('');

  const q = query.toLowerCase();

  // Strom: pojišťovna → kategorie → produkty (s filtrem + uživatelské oblasti).
  const tree = useMemo(() => {
    return insurers
      .map((ins) => {
        const insProducts = products.filter((p) => p.insurerId === ins.id);
        const matchesInsurer = ins.name.toLowerCase().includes(q) || ins.tradeName.toLowerCase().includes(q);
        const filtered = insProducts.filter(
          (p) =>
            matchesInsurer ||
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.externalCode.toLowerCase().includes(q),
        );
        const derived = filtered.map((p) => p.category);
        // Prázdné, uživatelem přidané oblasti (zobrazí se i bez produktů).
        const extra = (extraCategories[ins.id] ?? []).filter(
          (c) => matchesInsurer || q === '' || c.toLowerCase().includes(q),
        );
        const categories = Array.from(new Set([...derived, ...extra]));
        return {
          ins,
          totalCount: insProducts.length,
          categories: categories.map((cat) => ({
            cat,
            items: filtered.filter((p) => p.category === cat),
          })),
        };
      })
      .filter((g) => g.categories.length > 0 || (extraCategories[g.ins.id]?.length ?? 0) > 0);
  }, [insurers, products, extraCategories, q]);

  const toggleIns = (id: string) => setOpenInsurer((p) => ({ ...p, [id]: !p[id] }));
  const toggleCat = (key: string) => setOpenCat((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div>
      <PageHeader
        title="Produkty"
        description="Produkty podle pojišťoven a oblastí. Rozklikněte oblast a upravte jednotlivé produkty i jejich sjednací kódy."
      />

      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Hledat pojišťovnu, oblast, produkt nebo kód…" />
      </div>

      <div className="space-y-3">
        {tree.map(({ ins, categories, totalCount }) => {
          const insOpen = Boolean(openInsurer[ins.id]) || q.length > 0;
          return (
            <div key={ins.id} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
              {/* Úroveň 1 – pojišťovna */}
              <button
                type="button"
                onClick={() => toggleIns(ins.id)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-muted/50"
              >
                {insOpen ? <ChevronDown className="h-5 w-5 shrink-0 text-muted" /> : <ChevronRight className="h-5 w-5 shrink-0 text-muted" />}
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-xs font-bold text-brand-700">
                  {ins.logoText}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-foreground">{ins.tradeName}</span>
                  <span className="block truncate text-xs text-subtle">{ins.name}</span>
                </span>
                <Badge tone="brand">{totalCount} produktů</Badge>
              </button>

              {insOpen && (
                <div className="space-y-2 border-t border-border bg-surface-muted/20 p-3">
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewCatName('');
                        setNewCatFor(ins.id);
                      }}
                    >
                      <FolderPlus className="mr-1.5 h-3.5 w-3.5" />
                      Přidat oblast
                    </Button>
                  </div>
                  {categories.map(({ cat, items }) => {
                    const catKey = `${ins.id}::${cat}`;
                    const catOpen = Boolean(openCat[catKey]) || q.length > 0;
                    return (
                      <div key={catKey} className="overflow-hidden rounded-xl border border-border bg-surface">
                        {/* Úroveň 2 – kategorie */}
                        <button
                          type="button"
                          onClick={() => toggleCat(catKey)}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-surface-muted/50"
                        >
                          {catOpen ? <ChevronDown className="h-4 w-4 shrink-0 text-muted" /> : <ChevronRight className="h-4 w-4 shrink-0 text-muted" />}
                          <Badge tone="neutral">{cat}</Badge>
                          <span className="ml-auto text-xs text-subtle">{items.length} produktů</span>
                        </button>

                        {catOpen && (
                          <div className="border-t border-border">
                            {items.map((p) => (
                              <div
                                key={p.id}
                                className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5 last:border-0"
                              >
                                <div className="min-w-0">
                                  <div className="truncate text-sm font-medium text-foreground">{p.name}</div>
                                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-subtle">
                                    <span>
                                      Sjednací kód:{' '}
                                      <span className={p.externalCode ? 'font-medium text-foreground' : ''}>
                                        {p.externalCode || '—'}
                                      </span>
                                    </span>
                                    {p.calculatorEnabled && <span className="text-brand-600">v kalkulačce</span>}
                                  </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                  <StatusPill status={p.status} />
                                  <RowActions
                                    active={p.status === 'aktivni'}
                                    onEdit={() => setEditing(p)}
                                    onToggle={() => saveProduct({ ...p, status: p.status === 'aktivni' ? 'neaktivni' : 'aktivni' })}
                                    onDelete={() => setToDelete(p)}
                                  />
                                </div>
                              </div>
                            ))}
                            <div className="px-4 py-2.5">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setEditing({ ...emptyProduct(ins.id, cat), id: `new_${Date.now()}` })}
                              >
                                <Plus className="mr-1.5 h-3.5 w-3.5" />
                                Přidat produkt do „{cat}"
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {tree.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface px-5 py-10 text-center text-muted">
            Nic neodpovídá hledání.
          </div>
        )}
      </div>

      {editing && (
        <FormModal
          open
          title={products.some((p) => p.id === editing.id) ? 'Upravit produkt' : 'Nový produkt'}
          fields={fields}
          value={editing}
          onChange={setEditing}
          onSubmit={() => saveProduct(editing)}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Smazat produkt"
        message={`Opravdu smazat „${toDelete?.name}"?`}
        onConfirm={() => toDelete && removeProduct(toDelete.id)}
        onClose={() => setToDelete(null)}
      />

      <Modal
        open={Boolean(newCatFor)}
        onClose={() => setNewCatFor(null)}
        title="Přidat produktovou oblast"
        description={'Vytvoří novou oblast u pojišťovny. Produkty do ní pak přidáte tlačítkem „Přidat produkt".'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setNewCatFor(null)}>
              Zrušit
            </Button>
            <Button
              disabled={!newCatName.trim()}
              onClick={() => {
                if (newCatFor && newCatName.trim()) {
                  addCategory(newCatFor, newCatName.trim());
                  setOpenInsurer((p) => ({ ...p, [newCatFor]: true }));
                  setOpenCat((p) => ({ ...p, [`${newCatFor}::${newCatName.trim().toUpperCase()}`]: true }));
                }
                setNewCatFor(null);
              }}
            >
              Přidat oblast
            </Button>
          </>
        }
      >
        <Input
          label="Název oblasti"
          placeholder="např. AUTO, MAJETEK, ŽIVOT…"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value.toUpperCase())}
        />
      </Modal>
    </div>
  );
}
