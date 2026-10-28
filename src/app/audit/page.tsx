'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuditRunner } from '@/components/audit/AuditRunner';
import { Sparkles, ShieldCheck, Zap, Smartphone, Search } from 'lucide-react';

function AuditContent() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get('url') || '';

  return (
    <div className="space-y-12 py-4">
      
      {/* Top Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
          Live Website Growth Diagnostic
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight font-display">
          Inspect Your Website Health in Real Time
        </h1>
        <p className="text-sm text-charcoal-600 leading-relaxed">
          SiteGrow crawls your live website, tests mobile viewport configurations, inspects tap-to-call phone links, 
          evaluates image alt tags, and checks search meta tags.
        </p>
      </div>

      {/* Main Interactive Audit Runner */}
      <AuditRunner initialUrl={initialUrl} />

      {/* Audit Scope & Transparency Checklist */}
      <div className="max-w-4xl mx-auto bg-surface-warm rounded-2xl p-6 sm:p-8 border border-border space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-charcoal-900 text-sm uppercase tracking-wider">
            Verified Audit Methodology & Check Standards
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-charcoal-600 pt-2">
          <div className="bg-surface p-3.5 rounded-xl border border-border space-y-1">
            <span className="font-bold text-charcoal-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-lime-dark"></span>
              Enquiry Readiness
            </span>
            <p className="text-charcoal-500 text-[11px] leading-normal">
              Detects tel: click-to-call links, mailto: direct email anchors, contact form elements, and high-intent CTA keywords.
            </p>
          </div>

          <div className="bg-surface p-3.5 rounded-xl border border-border space-y-1">
            <span className="font-bold text-charcoal-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-lime-dark"></span>
              Search Discovery
            </span>
            <p className="text-charcoal-500 text-[11px] leading-normal">
              Inspects &lt;title&gt; length, meta description length, singular &lt;h1&gt; declaration, and canonical link attributes.
            </p>
          </div>

          <div className="bg-surface p-3.5 rounded-xl border border-border space-y-1">
            <span className="font-bold text-charcoal-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-lime-dark"></span>
              Mobile Usability
            </span>
            <p className="text-charcoal-500 text-[11px] leading-normal">
              Verifies width=device-width viewport configuration and scans all content images for missing alt descriptions.
            </p>
          </div>
        </div>

        <p className="text-[11px] text-charcoal-500 pt-2 border-t border-border-subtle">
          <strong>Honesty Disclosure:</strong> SiteGrow executes live network and HTML DOM inspection for public URLs. 
          Performance measurements reflect server Time-to-First-Byte (TTFB) and payload size. Real user field metrics (CrUX) 
          require a connected PageSpeed API key and are clearly flagged.
        </p>
      </div>

    </div>
  );
}

export default function AuditPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-charcoal-500">Loading audit tool...</div>}>
      <AuditContent />
    </Suspense>
  );
}

