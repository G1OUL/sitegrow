'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuditResult, IssueStatus } from '@/types';
import { 
  getStoredAudits, 
  getActiveAudit, 
  setActiveAuditId, 
  updateRecommendationStatus 
} from '@/lib/storage';
import { HISTORICAL_PROGRESS_DATA } from '@/lib/sampleData';
import { AuditHeaderBar } from '@/components/dashboard/AuditHeaderBar';
import { ScoreGauge } from '@/components/common/ScoreGauge';
import { PillarCard } from '@/components/common/PillarCard';
import { QuickRecommendations } from '@/components/dashboard/QuickRecommendations';
import { HistoricalChart } from '@/components/dashboard/HistoricalChart';
import { 
  PhoneCall, 
  Search, 
  Smartphone, 
  Zap, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function DashboardPage() {
  const [audits, setAudits] = useState<AuditResult[]>([]);
  const [activeAudit, setActiveAudit] = useState<AuditResult | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredAudits();
    setAudits(stored);
    const active = getActiveAudit();
    setActiveAudit(active);
    setMounted(true);
  }, []);

  const handleSelectAudit = (id: string) => {
    setActiveAuditId(id);
    const target = audits.find(a => a.id === id);
    if (target) {
      setActiveAudit(target);
    }
  };

  const handleStatusChange = (recId: string, newStatus: IssueStatus) => {
    if (!activeAudit) return;
    const updated = updateRecommendationStatus(activeAudit.id, recId, newStatus);
    if (updated) {
      setActiveAudit(updated);
      setAudits(prev => prev.map(a => a.id === updated.id ? updated : a));
    }
  };

  if (!mounted || !activeAudit) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-lime-brand border-t-transparent animate-spin mx-auto"></div>
        <p className="text-xs text-charcoal-500 font-medium">Loading website health dashboard...</p>
      </div>
    );
  }

  // Issue count by severity
  const severityCounts = {
    critical: activeAudit.recommendations.filter(r => r.severity === 'critical' && r.status !== 'resolved').length,
    high: activeAudit.recommendations.filter(r => r.severity === 'high' && r.status !== 'resolved').length,
    medium: activeAudit.recommendations.filter(r => r.severity === 'medium' && r.status !== 'resolved').length,
    low: activeAudit.recommendations.filter(r => r.severity === 'low' && r.status !== 'resolved').length,
    resolved: activeAudit.recommendations.filter(r => r.status === 'resolved').length,
  };

  // Historical data for this clean URL or fallback
  const historicalPoints = HISTORICAL_PROGRESS_DATA[activeAudit.cleanUrl] || [
    { 
      date: 'Baseline', 
      overallScore: activeAudit.previousScore || 60, 
      conversionScore: 50, 
      seoScore: 65, 
      usabilityScore: 60, 
      performanceScore: 55 
    },
    { 
      date: 'Latest', 
      overallScore: activeAudit.overallScore, 
      conversionScore: activeAudit.pillars.conversion.score, 
      seoScore: activeAudit.pillars.seo.score, 
      usabilityScore: activeAudit.pillars.usability.score, 
      performanceScore: activeAudit.pillars.performance.score 
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* 1. Header Bar with Switcher & Actions */}
      <AuditHeaderBar
        audits={audits}
        activeAudit={activeAudit}
        onSelectAudit={handleSelectAudit}
      />

      {/* 2. Primary KPI Row: Overall Health Gauge + Severity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Overall Health Score Card */}
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                Website Health Score
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-warm text-charcoal-700 border border-border">
                Weighted Aggregate
              </span>
            </div>

            <ScoreGauge
              score={activeAudit.overallScore}
              size="lg"
              industryAverage={activeAudit.industryAverage}
              subtitle="Calculated across 14 technical, mobile usability & enquiry checks"
            />
          </div>

          <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-charcoal-500">
            <span>Previous Scan: {activeAudit.previousScore || 60}</span>
            <span className="text-emerald-700 font-bold">
              +{activeAudit.overallScore - (activeAudit.previousScore || 60)} pts gained
            </span>
          </div>
        </div>

        {/* Issues by Severity Summary Box */}
        <div className="lg:col-span-2 bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-charcoal-900 text-base">Issue Severity Breakdown</h3>
              <Link
                href="/recommendations"
                className="text-xs font-semibold text-charcoal-800 hover:text-charcoal-900 hover:underline flex items-center gap-1"
              >
                <span>View Recommendations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-xs text-charcoal-500 mb-6">
              Prioritize resolving Critical and High severity issues to remove conversion blockers.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Critical */}
              <div className="p-4 rounded-xl bg-red-50/60 border border-red-200 space-y-1">
                <div className="flex items-center gap-1.5 text-red-700 text-xs font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Critical</span>
                </div>
                <div className="text-3xl font-extrabold text-red-800 font-display">
                  {severityCounts.critical}
                </div>
                <span className="text-[11px] text-red-600 block">Blocks Enquiries</span>
              </div>

              {/* High */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-800 text-xs font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>High Impact</span>
                </div>
                <div className="text-3xl font-extrabold text-amber-900 font-display">
                  {severityCounts.high}
                </div>
                <span className="text-[11px] text-amber-700 block">SEO & Usability</span>
              </div>

              {/* Medium & Low */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
                <div className="flex items-center gap-1.5 text-blue-700 text-xs font-semibold">
                  <Info className="w-3.5 h-3.5" />
                  <span>Med & Low</span>
                </div>
                <div className="text-3xl font-extrabold text-blue-900 font-display">
                  {severityCounts.medium + severityCounts.low}
                </div>
                <span className="text-[11px] text-blue-700 block">Best Practices</span>
              </div>

              {/* Resolved */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolved</span>
                </div>
                <div className="text-3xl font-extrabold text-emerald-900 font-display">
                  {severityCounts.resolved}
                </div>
                <span className="text-[11px] text-emerald-700 block">Fixes Applied</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-charcoal-500">
            <span>
              Total checks evaluated: <strong>{activeAudit.checks.length} checks</strong>
            </span>
            <span className="text-charcoal-600 font-medium">
              Initial server response latency: <strong>{activeAudit.metrics.responseTimeMs} ms</strong>
            </span>
          </div>
        </div>

      </div>

      {/* 3. The 4 Growth Pillars Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-charcoal-900 text-base">Core Health Indicators</h3>
          <span className="text-xs text-charcoal-500">Click any card to inspect checks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <PillarCard
            type="conversion"
            pillar={activeAudit.pillars.conversion}
            onClick={() => window.location.href = '/recommendations'}
          />
          <PillarCard
            type="seo"
            pillar={activeAudit.pillars.seo}
            onClick={() => window.location.href = '/recommendations'}
          />
          <PillarCard
            type="usability"
            pillar={activeAudit.pillars.usability}
            onClick={() => window.location.href = '/recommendations'}
          />
          <PillarCard
            type="performance"
            pillar={activeAudit.pillars.performance}
            onClick={() => window.location.href = '/recommendations'}
          />
        </div>
      </div>

      {/* 4. Top Quick Recommendations */}
      <QuickRecommendations
        recommendations={activeAudit.recommendations}
        onStatusChange={handleStatusChange}
      />

      {/* 5. Historical Growth Progress Chart */}
      <HistoricalChart
        data={historicalPoints}
        siteName={activeAudit.siteName}
      />

      {/* 6. Recent Scans & Quick Access */}
      <div className="bg-surface rounded-xl p-6 border border-border shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-charcoal-900 text-base">Recent Website Audits</h3>
          <Link
            href="/reports"
            className="text-xs font-semibold text-charcoal-800 hover:text-charcoal-900 hover:underline flex items-center gap-1"
          >
            <span>View All Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-border text-xs">
          {audits.map((a) => (
            <div
              key={a.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-warm/40 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                  a.overallScore >= 75 ? 'bg-lime-subtle text-charcoal-900 border border-lime-muted' : 'bg-amber-100 text-amber-900'
                }`}>
                  {a.overallScore}
                </div>
                <div>
                  <h4 className="font-bold text-charcoal-900">{a.siteName}</h4>
                  <p className="text-charcoal-500">{a.cleanUrl}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-charcoal-400">
                  {new Date(a.timestamp).toLocaleDateString()}
                </span>
                <span className="text-charcoal-600 font-semibold">
                  {a.recommendations.filter(r => r.status !== 'resolved').length} Open Issues
                </span>
                <Link
                  href={`/reports/${a.id}`}
                  className="px-2.5 py-1 rounded bg-surface border border-border text-charcoal-800 hover:border-charcoal-400 font-medium"
                >
                  Report
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

