'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuditResult, IssueStatus } from '@/types';
import { getStoredAudits, getActiveAudit, updateRecommendationStatus } from '@/lib/storage';
import { RecommendationsBoard } from '@/components/recommendations/RecommendationsBoard';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RecommendationsPage() {
  const [activeAudit, setActiveAudit] = useState<AuditResult | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const active = getActiveAudit();
    setActiveAudit(active);
    setMounted(true);
  }, []);

  const handleUpdateStatus = (recId: string, status: IssueStatus) => {
    if (!activeAudit) return;
    const updated = updateRecommendationStatus(activeAudit.id, recId, status);
    if (updated) {
      setActiveAudit(updated);
    }
  };

  if (!mounted || !activeAudit) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-lime-brand border-t-transparent animate-spin mx-auto"></div>
        <p className="text-xs text-charcoal-500 font-medium">Loading recommendations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner Navigation Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
            Fix Action Checklist
          </span>
          <h1 className="text-2xl font-extrabold text-charcoal-900 tracking-tight font-display">
            Prioritized Growth Recommendations
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface border border-border text-charcoal-700 hover:bg-surface-warm"
          >
            ← Back to Dashboard
          </Link>
          <Link
            href={`/reports/${activeAudit.id}`}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-charcoal-900 text-white hover:bg-charcoal-800"
          >
            View Full Report
          </Link>
        </div>
      </div>

      {/* Main Board */}
      <RecommendationsBoard
        audit={activeAudit}
        onUpdateStatus={handleUpdateStatus}
      />

    </div>
  );
}

