'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuditResult } from '@/types';
import { saveAudit } from '@/lib/storage';
import { formatUrl, extractDomain } from '@/lib/utils';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  Check, 
  Eye, 
  ExternalLink 
} from 'lucide-react';

interface AuditRunnerProps {
  initialUrl?: string;
  onAuditComplete?: (audit: AuditResult) => void;
}

export function AuditRunner({ initialUrl = '', onAuditComplete }: AuditRunnerProps) {
  const router = useRouter();
  const [url, setUrl] = useState(initialUrl);
  const [scanDepth, setScanDepth] = useState<'quick' | 'deep'>('quick');
  const [loading, setLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);
  const hasAutoRunRef = useRef(false);

  useEffect(() => {
    if (initialUrl && initialUrl.trim() && !hasAutoRunRef.current) {
      hasAutoRunRef.current = true;
      setUrl(initialUrl);
      handleRunAudit(initialUrl);
    }
  }, [initialUrl]);

  const scanSteps = [
    { title: 'Connecting & Handshake', desc: 'Validating SSL certificate and DNS' },
    { title: 'Response & Latency', desc: 'Measuring TTFB and document weight' },
    { title: 'Metadata & SEO Structure', desc: 'Evaluating title, description, and H1 tags' },
    { title: 'Usability & Accessibility', desc: 'Checking mobile viewport & image alt tags' },
    { title: 'Enquiry & Conversion Triggers', desc: 'Scanning for tap-to-call, forms, and CTAs' },
    { title: 'Generating Action Plan', desc: 'Prioritizing recommendations by business impact' },
  ];

  const samplePresets = [
    { name: 'Apex Plumbing (Demo)', url: 'https://apexplumbing-demo.com' },
    { name: 'Artisan Hearth (Demo)', url: 'https://artisanhearth-demo.com' },
    { name: 'Harborview Law (Demo)', url: 'https://harborviewlaw-demo.com' },
    { name: 'Example Domain (Live)', url: 'https://example.com' },
  ];

  const handleRunAudit = async (targetUrlOverride?: string) => {
    const rawTarget = targetUrlOverride || url;
    if (!rawTarget || !rawTarget.trim()) {
      setErrorMessage('Please enter a website URL to begin the audit.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);
    setCurrentStepIndex(0);
    setResult(null);

    const formatted = formatUrl(rawTarget);

    // Step simulation ticker while server-side fetch runs
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < scanSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formatted, scanDepth }),
      });

      clearInterval(stepInterval);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete website audit.');
      }

      const audit: AuditResult = data.audit;
      setCurrentStepIndex(scanSteps.length - 1);
      setResult(audit);
      saveAudit(audit);

      if (onAuditComplete) {
        onAuditComplete(audit);
      }
    } catch (err: unknown) {
      clearInterval(stepInterval);
      const msg = err instanceof Error ? err.message : 'An error occurred during audit.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Input Box */}
      <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-card relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime-brand/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-lime-subtle text-charcoal-900 border border-lime-muted inline-flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-lime-dark" />
              <span>Real Automated Crawler Checks</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight font-display">
              Audit Any Website for Growth Opportunities
            </h2>
            <p className="text-sm text-charcoal-600 mt-1.5 leading-relaxed">
              Enter your domain name below. SiteGrow analyzes conversion friction, mobile usability, 
              SEO tags, and speed — delivering a prioritized checklist for your business.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunAudit();
            }}
            className="mt-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                  <Globe className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g., mysite.com or https://example.com"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-border bg-surface text-charcoal-900 placeholder-charcoal-400 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-lime-brand focus:border-charcoal-900 shadow-subtle disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-lime-brand text-charcoal-900 hover:bg-lime-hover shadow-subtle hover:shadow-limeGlow transition-all duration-150 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Auditing Site...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-charcoal-900/10" />
                    <span>Run Website Audit</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-charcoal-500">
              <span className="font-medium">Try a sample:</span>
              {samplePresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setUrl(preset.url);
                    handleRunAudit(preset.url);
                  }}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-md bg-surface-warm hover:bg-surface-subtle text-charcoal-700 border border-border transition-colors font-medium hover:border-charcoal-400"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </form>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Audit Request Failed</p>
                <p className="mt-0.5 text-xs text-red-700 leading-relaxed">{errorMessage}</p>
                <p className="mt-2 text-xs text-red-600 font-medium">
                  Tip: Ensure the site is publicly reachable and not blocking automated requests. You can also try our verified sample businesses above.
                </p>
              </div>
            </div>
          )}

          {/* Live Progress State */}
          {loading && (
            <div className="mt-8 p-6 rounded-xl bg-charcoal-900 text-white space-y-4 shadow-dropdown animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-lime-brand animate-spin" />
                  <span className="font-bold text-lime-brand uppercase tracking-wider">
                    Running Live Audit: {extractDomain(url)}
                  </span>
                </div>
                <span className="text-charcoal-400 font-mono">
                  Phase {currentStepIndex + 1} of {scanSteps.length}
                </span>
              </div>

              {/* Step indicator bar */}
              <div className="w-full bg-charcoal-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-lime-brand h-full transition-all duration-300"
                  style={{
                    width: `${((currentStepIndex + 1) / scanSteps.length) * 100}%`,
                  }}
                />
              </div>

              {/* Step status logs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                {scanSteps.map((step, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div
                      key={step.title}
                      className={`flex items-start gap-2 p-2 rounded-lg ${
                        isCurrent
                          ? 'bg-charcoal-800 text-white border border-lime-brand/30'
                          : isDone
                          ? 'text-charcoal-300 opacity-80'
                          : 'text-charcoal-500 opacity-40'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-lime-brand shrink-0 mt-0.5" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-lime-brand animate-spin shrink-0 mt-0.5" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-charcoal-600 inline-block shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold">{step.title}</p>
                        <p className="text-[10px] text-charcoal-400">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Audit Completed View */}
      {result && !loading && (
        <div className="mt-8 space-y-6 animate-in slide-in-from-bottom-3 duration-200">
          <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-charcoal-900 text-base">
                  Audit Completed for {result.siteName}
                </h3>
                <p className="text-xs text-charcoal-600">
                  Calculated Health Score: <strong>{result.overallScore}/100</strong> • Found{' '}
                  <strong>{result.recommendations.length} action items</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-charcoal-900 text-white hover:bg-charcoal-800 transition-all flex items-center justify-center gap-2"
              >
                <span>Open in Dashboard</span>
                <ArrowRight className="w-4 h-4 text-lime-brand" />
              </button>
            </div>
          </div>

          {/* Quick Check List Breakdown */}
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-charcoal-900 text-base">Verified Technical Findings</h4>
              <span className="text-xs text-charcoal-500 font-medium">
                {result.checks.filter(c => c.type === 'measured').length} Live Measured Checks
              </span>
            </div>

            <div className="divide-y divide-border">
              {result.checks.map((chk) => (
                <div key={chk.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        chk.status === 'passed' ? 'bg-emerald-500' : chk.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm font-semibold text-charcoal-900">{chk.name}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-surface-warm text-charcoal-600 border border-border">
                        {chk.type}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-500 pl-4">{chk.details}</p>
                  </div>

                  <div className="sm:text-right pl-4 sm:pl-0 shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      chk.status === 'passed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : chk.status === 'warning'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {String(chk.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

