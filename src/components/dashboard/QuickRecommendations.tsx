'use client';

import React from 'react';
import Link from 'next/link';
import { AuditRecommendation, IssueStatus } from '@/types';
import { SeverityBadge } from '../common/SeverityBadge';
import { ArrowRight, CheckCircle2, Clock, CircleDot, Sparkles } from 'lucide-react';

interface QuickRecommendationsProps {
  recommendations: AuditRecommendation[];
  onStatusChange: (recId: string, newStatus: IssueStatus) => void;
}

export function QuickRecommendations({
  recommendations,
  onStatusChange,
}: QuickRecommendationsProps) {
  // Sort recommendations by severity and impact score
  const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1, good: 0 };
  const sorted = [...recommendations].sort((a, b) => {
    const diff = (priorityOrder[b.severity] || 0) - (priorityOrder[a.severity] || 0);
    if (diff !== 0) return diff;
    return b.impactScore - a.impactScore;
  });

  const topItems = sorted.slice(0, 3);

  return (
    <div className="bg-surface rounded-xl p-6 border border-border shadow-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-charcoal-900 text-base flex items-center gap-2">
            <span>High-Impact Recommendations</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-lime-subtle text-charcoal-900 border border-lime-muted">
              {recommendations.filter(r => r.status !== 'resolved').length} Open
            </span>
          </h3>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Fix these highest-leverage items first to increase your enquiry conversion rate
          </p>
        </div>

        <Link
          href="/recommendations"
          className="text-xs font-semibold text-charcoal-800 hover:text-charcoal-900 flex items-center gap-1 hover:underline"
        >
          <span>View all ({recommendations.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {topItems.map((rec) => {
          const isResolved = rec.status === 'resolved';
          const isInProgress = rec.status === 'in_progress';

          return (
            <div
              key={rec.id}
              className={`p-4 rounded-xl border transition-all duration-150 ${
                isResolved
                  ? 'bg-emerald-50/40 border-emerald-200 opacity-75'
                  : 'bg-surface-warm/60 border-border hover:border-charcoal-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityBadge severity={rec.severity} size="sm" />
                    <span className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">
                      {rec.category}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      +{rec.impactScore} pts
                    </span>
                  </div>

                  <h4 className={`text-sm font-bold ${isResolved ? 'line-through text-charcoal-500' : 'text-charcoal-900'}`}>
                    {rec.title}
                  </h4>

                  <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                    {rec.whyItMatters}
                  </p>
                </div>

                {/* Status Dropdown / Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <select
                    value={rec.status}
                    onChange={(e) => onStatusChange(rec.id, e.target.value as IssueStatus)}
                    className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border transition-all cursor-pointer ${
                      isResolved
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : isInProgress
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-white text-charcoal-700 border-border hover:border-charcoal-400'
                    }`}
                  >
                    <option value="open">⭕ Open</option>
                    <option value="in_progress">⏳ In Progress</option>
                    <option value="resolved">✅ Resolved</option>
                  </select>

                  <Link
                    href={`/recommendations#${rec.id}`}
                    className="text-[11px] text-charcoal-500 hover:text-charcoal-900 underline"
                  >
                    How to fix →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

