'use client';

import React from 'react';
import { RecordStep } from '../../shared/record/RecordStep';
import type { RecordState } from '../../shared/record/types';
import type { PolicyholderState } from './data';
import { buildLiabilityRecordInput } from './liabilityRecordInput';

interface LiabilityStepRecordProps {
  limit: string;
  added: Record<string, boolean>;
  policyholder: PolicyholderState;
  record: RecordState;
  onRecordChange: (next: RecordState) => void;
  onBack: () => void;
  onConclude: () => void;
}

/**
 * Krok 3 odpovědnosti = sdílený „Záznam z jednání". Tento wrapper jen sestaví
 * produktový vstup (RecordInput) z dat kroků 1+2 a předá ho komponentě RecordStep.
 */
export function LiabilityStepRecord({
  limit,
  added,
  policyholder,
  record,
  onRecordChange,
  onBack,
  onConclude,
}: LiabilityStepRecordProps) {
  const input = buildLiabilityRecordInput(limit, added, policyholder);

  return (
    <RecordStep
      input={input}
      record={record}
      onRecordChange={onRecordChange}
      onBack={onBack}
      onConclude={onConclude}
    />
  );
}

export default LiabilityStepRecord;
