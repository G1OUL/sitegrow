'use client';

import React from 'react';
import Link from 'next/link';
import { AuditResult } from '@/types';
import { 
  Globe, 
  ExternalLink, 
  Clock, 
  PlusCircle, 
  FileDown, 
  ChevronDown, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface AuditHeaderBarProps {
  audits: AuditResult[];
  activeAudit: AuditResult;
  onSelectAudit: (auditId: string) => void;
  onReaudit?: () => void;
}

export function AuditHeaderBar({
  audits,
  activeAudit,
  onSelectAudit,
  onReaudit,
}: AuditHeaderBarProps) {
  const formattedDate = new Date(activeAudit.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border shadow-card mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Side: Website selector & metadata */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Active Website:
            </span>
            
            {/* Website Switcher Dropdown */}
            <div className="relative inline-block">
              <select
                value={activeAudit.id}
                onChange={(e) => onSelectAudit(e.target.value)}
                className="appearance-none bg-surface-warm font-bold text-base text-charcoal-900 border border-border rounded-lg pl-3 pr-8 py-1.5 hover:border-charcoal-400 focus:outline-none focus:ring-2 focus:ring-lime-brand cursor-pointer"
              >
                {audits.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.siteName} ({a.cleanUrl}) {a.isDemo ? '• Demo' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-charcoal-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {activeAudit.isDemo && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Sample Business Data
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-500">
            <a
              href={activeAudit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-charcoal-700 hover:text-charcoal-900 font-medium hover:underline"
            >
              <Globe className="w-3.5 h-3.5 text-charcoal-400" />
              <span>{activeAudit.url}</span>
              <ExternalLink className="w-3 h-3 text-charcoal-400" />
            </a>

            <span className="text-charcoal-300">•</span>

            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-charcoal-400" />
              <span>Audited: {formattedDate}</span>
            </span>

            <span className="text-charcoal-300">•</span>

            <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SSL TLS 1.3 Active</span>
            </span>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/audit?url=${encodeURIComponent(activeAudit.url)}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-surface-warm border border-border text-charcoal-800 hover:bg-surface-subtle transition-all"
            title="Re-run website health check"
          >
            <RefreshCw className="w-3.5 h-3.5 text-charcoal-500" />
            <span>Re-audit</span>
          </Link>

          <Link
            href="/audit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-charcoal-900 text-white hover:bg-charcoal-800 transition-all shadow-subtle"
          >
            <PlusCircle className="w-4 h-4 text-lime-brand" />
            <span>Audit New Site</span>
          </Link>

          <Link
            href={`/reports/${activeAudit.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-surface border border-border text-charcoal-800 hover:bg-surface-warm transition-all"
          >
            <FileDown className="w-4 h-4 text-charcoal-500" />
            <span>View Full Report</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

