'use client';

import React from 'react';
import { Button, Modal } from '@/components/ui';
import { CompanyCommissionsPanel } from './CompanyCommissionsPanel';
import type { Company } from '../types';

export function CompanyCommissionsModal({ company, onClose }: { company: Company | null; onClose: () => void }) {
  if (!company) return null;
  return (
    <Modal
      open={Boolean(company)}
      onClose={onClose}
      title={`Provize – ${company.name}`}
      description="Nastavení provize per pojišťovna a produkt."
      size="xl"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Zavřít
        </Button>
      }
    >
      <CompanyCommissionsPanel companyId={company.id} />
    </Modal>
  );
}
