'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuditResult } from '@/types';
import { getStoredAudits, setActiveAuditId } from '@/lib/storage';
import { ScoreGauge } from '@/components/common/ScoreGauge';
import { 
  FileText, 
  ExternalLink, 
  Calendar, 
  Clock, 
  ArrowRight, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Printer 
} from 'lucide-react';

export default function ReportsIndexPage() {
  const [audits, setAudits] = useState<AuditResult[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const list = getStoredAudits();
    setAudits(list);
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-20 text-center text-xs text-charcoal-500">
        Loading audit history...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
            Audit Archive & Reports
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight font-display">
            Client & Business Audit Reports
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Access, print, and export previous audits with full technical findings and fix plans.
          </p>
        </div>

        <Link
          href="/audit"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-lime-brand text-charcoal-900 hover:bg-lime-hover shadow-subtle hover:shadow-limeGlow transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Website Audit</span>
        </Link>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {audits.map((a) => {
          const openCount = a.recommendations.filter(r => r.status !== 'resolved').length;
          const resolvedCount = a.recommendations.filter(r => r.status === 'resolved').length;

          return (
            <div
              key={a.id}
              className="bg-surface rounded-2xl p-6 border border-border shadow-card hover:border-charcoal-300 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider block">
                      Website Audit Report
                    </span>
                    <h3 className="font-bold text-charcoal-900 text-lg mt-0.5 leading-snug">
                      {a.siteName}
                    </h3>
                    <p className="text-xs text-charcoal-500">{a.cleanUrl}</p>
                  </div>

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-base font-display ${
                    a.overallScore >= 75
                      ? 'bg-lime-subtle text-charcoal-900 border border-lime-muted'
                      : a.overallScore >= 50
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-red-100 text-red-900 border border-red-200'
                  }`}>
                    {a.overallScore}
                  </div>
                </div>

                {/* Audit date & metadata */}
                <div className="text-xs text-charcoal-500 space-y-1.5 pt-2 border-t border-border-subtle">
                  <div className="flex items-center justify-between">
                    <span>Audited:</span>
                    <span className="font-medium text-charcoal-700">
                      {new Date(a.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Response Latency:</span>
                    <span className="font-medium text-charcoal-700">
                      {a.metrics.responseTimeMs} ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    <span className="font-semibold text-charcoal-800">
                      {openCount} Open • {resolvedCount} Resolved
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border-subtle flex items-center gap-2">
                <Link
                  href={`/reports/${a.id}`}
                  onClick={() => setActiveAuditId(a.id)}
                  className="flex-1 py-2 text-center text-xs font-bold bg-charcoal-900 text-white rounded-xl hover:bg-charcoal-800 transition-all flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-lime-brand" />
                  <span>View Report</span>
                </Link>

                <Link
                  href={`/reports/${a.id}`}
                  onClick={() => {
                    setActiveAuditId(a.id);
                    setTimeout(() => window.print(), 300);
                  }}
                  className="p-2 rounded-xl bg-surface-warm border border-border text-charcoal-700 hover:bg-surface-subtle"
                  title="Print / Save PDF"
                >
                  <Printer className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

