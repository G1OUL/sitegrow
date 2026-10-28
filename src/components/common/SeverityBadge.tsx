import React from 'react';
import { Severity } from '@/types';
import { getSeverityStyle } from '@/lib/utils';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md';
}

export function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  const styles = getSeverityStyle(severity);

  const icons = {
    critical: AlertCircle,
    high: AlertCircle,
    medium: AlertTriangle,
    low: Info,
    good: CheckCircle2,
  };

  const Icon = icons[severity] || Info;

  const label = {
    critical: 'Critical Fix',
    high: 'High Impact',
    medium: 'Medium Priority',
    low: 'Low Priority',
    good: 'Optimal',
  }[severity];

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${styles.bg} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{label}</span>
    </span>
  );
}

