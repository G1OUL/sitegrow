import React from 'react';
import { MeasurementType } from '@/types';
import { Check, Cpu, KeyRound } from 'lucide-react';

interface MeasurementTagProps {
  type: MeasurementType;
}

export function MeasurementTag({ type }: MeasurementTagProps) {
  if (type === 'measured') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
        <span>Live Verified</span>
      </span>
    );
  }

  if (type === 'estimated') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
        <Cpu className="w-3 h-3 text-blue-600" />
        <span>Calculated Estimate</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-charcoal-100 text-charcoal-600 border border-charcoal-200">
      <KeyRound className="w-3 h-3 text-charcoal-400" />
      <span>Requires API Key</span>
    </span>
  );
}

