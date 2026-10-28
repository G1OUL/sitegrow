'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuditResult, UserSettings } from '@/types';
import { ScoreGauge } from '../common/ScoreGauge';
import { SeverityBadge } from '../common/SeverityBadge';
import { MeasurementTag } from '../common/MeasurementTag';
import { 
  Printer, 
  Download, 
  Share2, 
  Check, 
  Globe, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Info,
  Building,
  ArrowLeft
} from 'lucide-react';

interface ReportViewProps {
  audit: AuditResult;
  settings?: UserSettings;
}

export function ReportView({ audit, settings }: ReportViewProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const formattedDate = new Date(audit.timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(audit, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sitegrow-audit-${audit.cleanUrl}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Top Action Toolbar (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden bg-surface p-4 rounded-xl border border-border shadow-subtle">
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-700 hover:text-charcoal-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Reports</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-warm text-charcoal-800 border border-border hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Link'}</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-warm text-charcoal-800 border border-border hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors shadow-subtle cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-lime-brand" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Main Printable Report Canvas */}
      <div className="bg-surface rounded-2xl p-8 sm:p-12 border border-border shadow-card print:border-none print:shadow-none print:p-0">
        
        {/* Report Header */}
        <div className="border-b border-border pb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal-500">
                <span>SiteGrow Website Health Audit Report</span>
                {audit.isDemo && (
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 text-[10px]">
                    Demo Assessment
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold text-charcoal-900 tracking-tight font-display">
                {audit.siteName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-500">
                <span className="flex items-center gap-1 font-medium text-charcoal-700">
                  <Globe className="w-3.5 h-3.5 text-charcoal-400" />
                  {audit.url}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-charcoal-400" />
                  {formattedDate}
                </span>
              </div>
            </div>

            {/* Agency Custom Branding (if configured in settings) */}
            {settings?.agencyMode && (
              <div className="sm:text-right p-3 rounded-lg bg-surface-warm border border-border text-xs">
                <p className="font-semibold text-charcoal-500 uppercase tracking-wider text-[10px]">
                  Audit Prepared By
                </p>
                <p className="font-bold text-charcoal-900 text-sm mt-0.5">
                  {settings.agencyName || 'SiteGrow Certified Partner'}
                </p>
                <p className="text-[11px] text-charcoal-500 mt-0.5">
                  {settings.contactEmail}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Executive Summary & Score Block */}
        <div className="py-8 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Score Gauge */}
            <div className="flex justify-center md:border-r border-border md:pr-8">
              <ScoreGauge
                score={audit.overallScore}
                size="lg"
                industryAverage={audit.industryAverage}
                subtitle="Weighted Health Score calculated across 4 core growth pillars"
              />
            </div>

            {/* Executive Takeaway */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-lg font-bold text-charcoal-900">Executive Summary</h2>
              <p className="text-sm text-charcoal-600 leading-relaxed">
                SiteGrow performed an in-depth audit of <strong>{audit.cleanUrl}</strong> evaluating mobile enquiry pathways, 
                search discovery tags, usability constraints, and initial response latency.
              </p>
              
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="bg-surface-warm p-3 rounded-xl border border-border">
                  <span className="text-charcoal-500 block text-[11px]">Identified Opportunities</span>
                  <span className="text-base font-bold text-charcoal-900">
                    {audit.recommendations.length} Actionable Items
                  </span>
                </div>
                <div className="bg-surface-warm p-3 rounded-xl border border-border">
                  <span className="text-charcoal-500 block text-[11px]">Server Response Latency</span>
                  <span className="text-base font-bold text-charcoal-900">
                    {audit.metrics.responseTimeMs} ms
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 4 Pillar Breakdown */}
        <div className="py-8 border-b border-border space-y-4">
          <h2 className="text-lg font-bold text-charcoal-900">Growth Pillar Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(audit.pillars).map(([key, pillar]) => (
              <div key={key} className="bg-surface-warm/70 p-4 rounded-xl border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-charcoal-900">{pillar.label}</span>
                  <span className="font-bold text-charcoal-900 text-base">{pillar.score}/100</span>
                </div>
                <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lime-brand rounded-full"
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>
                <p className="text-xs text-charcoal-600">{pillar.statusText}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Full Findings Table */}
        <div className="py-8 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-charcoal-900">Itemized Verification Findings</h2>
            <span className="text-xs text-charcoal-500">
              {audit.checks.length} Individual Checks Conducted
            </span>
          </div>

          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-warm border-b border-border text-charcoal-700 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Verification Check</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Measured Result</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {audit.checks.map((chk) => (
                  <tr key={chk.id} className="hover:bg-surface-warm/40">
                    <td className="py-3 px-4 font-medium text-charcoal-900">
                      <div>{chk.name}</div>
                      <div className="text-[11px] text-charcoal-500 font-normal mt-0.5">{chk.details}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <MeasurementTag type={chk.type} />
                    </td>
                    <td className="py-3 px-4 font-mono text-charcoal-700 whitespace-nowrap">
                      {String(chk.value)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        chk.status === 'passed'
                          ? 'bg-emerald-50 text-emerald-800'
                          : chk.status === 'warning'
                          ? 'bg-amber-50 text-amber-800'
                          : chk.status === 'failed'
                          ? 'bg-red-50 text-red-800'
                          : 'bg-charcoal-100 text-charcoal-600'
                      }`}>
                        {chk.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Prioritized Recommendations Section */}
        <div className="py-8 border-b border-border space-y-5">
          <h2 className="text-lg font-bold text-charcoal-900">Actionable Growth Recommendations</h2>
          <div className="space-y-4">
            {audit.recommendations.map((rec, index) => (
              <div key={rec.id} className="p-4 rounded-xl border border-border bg-surface-warm/40 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-charcoal-900 text-white flex items-center justify-center text-[10px] font-bold">
                      {index + 1}
                    </span>
                    <h3 className="font-bold text-sm text-charcoal-900">{rec.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={rec.severity} size="sm" />
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      +{rec.impactScore} pts
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <strong className="text-charcoal-700 block">Why it matters:</strong>
                    <p className="text-charcoal-600 mt-0.5">{rec.whyItMatters}</p>
                  </div>
                  <div>
                    <strong className="text-charcoal-700 block">How to resolve:</strong>
                    <p className="text-charcoal-600 mt-0.5">{rec.howToFix}</p>
                  </div>
                </div>

                {rec.codeSnippet && (
                  <div className="mt-2 pt-2 border-t border-border-subtle">
                    <pre className="bg-charcoal-900 text-charcoal-100 p-2.5 rounded-lg text-[11px] font-mono overflow-x-auto">
                      <code>{rec.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Limitations & Methodology Disclaimer */}
        <div className="pt-8 space-y-3">
          <h3 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-charcoal-500" />
            <span>Audit Scope, Limitations & Methodology</span>
          </h3>
          <ul className="text-xs text-charcoal-500 space-y-1.5 list-disc pl-5 leading-relaxed">
            {audit.limitations.map((limitation, i) => (
              <li key={i}>{limitation}</li>
            ))}
            <li>
              Tested URL: <strong>{audit.url}</strong> at <strong>{audit.timestamp}</strong>. Changes made to the website after this timestamp are not reflected in this snapshot report.
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}

