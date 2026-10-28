'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  PhoneCall, 
  Smartphone, 
  Search, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Globe, 
  Clock, 
  Layers, 
  Check, 
  ChevronRight, 
  BarChart3, 
  FileText 
} from 'lucide-react';
import { formatUrl } from '@/lib/utils';
import { ScoreGauge } from '@/components/common/ScoreGauge';

export default function LandingPage() {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    const target = formatUrl(urlInput);
    router.push(`/audit?url=${encodeURIComponent(target)}`);
  };

  const samplePresets = [
    { label: 'Apex Plumbing (Demo)', url: 'https://apexplumbing-demo.com' },
    { label: 'Artisan Bakery (Demo)', url: 'https://artisanhearth-demo.com' },
    { label: 'Harborview Law (Demo)', url: 'https://harborviewlaw-demo.com' },
  ];

  return (
    <div className="space-y-24">
      
      {/* 1. Hero Section */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-4xl mx-auto space-y-6">
        
        {/* Value badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border shadow-subtle text-xs font-semibold text-charcoal-800">
          <span className="w-2 h-2 rounded-full bg-lime-brand border border-charcoal-900 inline-block"></span>
          <span>Built for Small Businesses, Freelancers & Local Service Providers</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-black text-charcoal-900 tracking-tight font-display leading-[1.12]">
          Turn website visitors into <span className="relative inline-block">
            <span className="relative z-10">paying enquiries.</span>
            <span className="absolute bottom-1.5 left-0 w-full h-3.5 bg-lime-brand/50 -rotate-1 rounded-sm -z-0"></span>
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
          Most small business websites lose 60% of potential phone calls and quote requests due to 
          hidden usability friction, missing mobile tap-to-call links, and SEO blindspots. 
          SiteGrow audits your website in seconds and tells you exactly what to fix.
        </p>

        {/* URL Input & CTA Bar */}
        <div className="pt-4 max-w-2xl mx-auto">
          <form onSubmit={handleStartAudit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                <Globe className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter your website (e.g. apexplumbing.com)"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-border bg-surface text-charcoal-900 placeholder-charcoal-400 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-lime-brand shadow-card"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-lime-brand text-charcoal-900 hover:bg-lime-hover shadow-subtle hover:shadow-limeGlow transition-all duration-150 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-charcoal-900/10" />
              <span>Audit My Website</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-charcoal-500">
            <span>Or explore real examples:</span>
            {samplePresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setUrlInput(preset.url);
                  router.push(`/audit?url=${encodeURIComponent(preset.url)}`);
                }}
                className="px-2.5 py-1 rounded-md bg-surface border border-border text-charcoal-700 hover:border-charcoal-400 font-medium transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Realistic Dashboard Preview Graphic */}
        <div className="pt-8">
          <div className="bg-surface rounded-2xl p-4 sm:p-6 border border-border shadow-dropdown text-left max-w-4xl mx-auto overflow-hidden">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
                <span className="text-xs font-mono text-charcoal-500 ml-2">sitegrow.app/dashboard/apex-plumbing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Live Audit Active
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Mini Gauge */}
              <div className="flex flex-col items-center justify-center p-4 bg-surface-warm rounded-xl border border-border">
                <ScoreGauge score={84} size="sm" industryAverage={67} />
                <span className="text-xs font-bold text-charcoal-800 mt-2">Overall Health Score</span>
              </div>

              {/* Pillars preview */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-warm border border-border text-xs">
                  <div className="flex items-center gap-2 font-semibold text-charcoal-800">
                    <PhoneCall className="w-4 h-4 text-lime-dark" />
                    <span>Enquiry Readiness (Tap-to-call, forms)</span>
                  </div>
                  <span className="font-bold text-emerald-700">92 / 100</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-warm border border-border text-xs">
                  <div className="flex items-center gap-2 font-semibold text-charcoal-800">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span>Mobile Usability & Image Alt Tags</span>
                  </div>
                  <span className="font-bold text-charcoal-800">88 / 100</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-warm border border-border text-xs">
                  <div className="flex items-center gap-2 font-semibold text-charcoal-800">
                    <Search className="w-4 h-4 text-amber-600" />
                    <span>Local SEO & Meta Descriptions</span>
                  </div>
                  <span className="font-bold text-amber-700">76 / 100</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified against 14 automated technical and usability benchmarks</span>
              </span>
              <Link
                href="/dashboard"
                className="font-semibold text-charcoal-900 hover:underline flex items-center gap-1"
              >
                <span>Explore Full Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* 2. The 4 Growth Pillars */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">The 4 Growth Pillars</span>
          <h2 className="text-3xl font-extrabold text-charcoal-900 tracking-tight font-display">
            Everything your small business needs to grow online
          </h2>
          <p className="text-sm text-charcoal-600">
            We don’t overwhelm you with 80 pages of confusing jargon. We focus strictly on the 4 factors that generate customer revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface rounded-xl p-6 border border-border shadow-card hover:border-charcoal-300 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-lime-subtle flex items-center justify-center text-charcoal-900 border border-lime-muted">
              <PhoneCall className="w-5 h-5 text-lime-dark" />
            </div>
            <h3 className="font-bold text-charcoal-900 text-base">1. Enquiry Readiness</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              We check for clickable tap-to-call phone numbers, contact forms, direct email links, and benefit-driven CTA buttons that convert mobile shoppers into inbound leads.
            </p>
          </div>

          <div className="bg-surface rounded-xl p-6 border border-border shadow-card hover:border-charcoal-300 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 border border-blue-200">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-charcoal-900 text-base">2. Mobile Usability</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              We verify your viewport scaling, check images for accessibility alt attributes, and flag layout issues that cause visitors to immediately bounce.
            </p>
          </div>

          <div className="bg-surface rounded-xl p-6 border border-border shadow-card hover:border-charcoal-300 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-200">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-charcoal-900 text-base">3. Local Search SEO</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              We inspect title tag length, meta descriptions, single H1 heading hierarchy, and canonical declarations so Google displays your business properly.
            </p>
          </div>

          <div className="bg-surface rounded-xl p-6 border border-border shadow-card hover:border-charcoal-300 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-200">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-charcoal-900 text-base">4. Speed & Security</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              We measure initial server latency (TTFB), HTML document weight, and active SSL/TLS encryption to keep your website fast, credible, and trustworthy.
            </p>
          </div>
        </div>
      </section>

      {/* 3. How It Works Workflow */}
      <section className="bg-surface-warm rounded-2xl p-8 sm:p-12 border border-border space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Simple 4-Step Workflow</span>
          <h2 className="text-3xl font-extrabold text-charcoal-900 tracking-tight font-display">
            From audit to customer phone calls in 4 steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-charcoal-900 text-lime-brand flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h4 className="font-bold text-charcoal-900 text-sm">Enter Website URL</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              No tracking code or DNS changes required. Just enter your domain to trigger an instant external scan.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-charcoal-900 text-lime-brand flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h4 className="font-bold text-charcoal-900 text-sm">Run Technical Checks</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Our automated crawler analyzes page metadata, headings, images, forms, and server response times.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-charcoal-900 text-lime-brand flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h4 className="font-bold text-charcoal-900 text-sm">Review Plain-English Fixes</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Every issue includes "What it is", "Why it matters", and exact copy-paste code or CMS directions.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-charcoal-900 text-lime-brand flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h4 className="font-bold text-charcoal-900 text-sm">Track Gains & Export Reports</h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Mark tasks as resolved to watch your score rise. Generate branded PDF reports for clients or stakeholders.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Real Example Results (Before vs After) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Measurable Impact</span>
          <h2 className="text-3xl font-extrabold text-charcoal-900 tracking-tight font-display">
            Real improvements for real businesses
          </h2>
          <p className="text-sm text-charcoal-600">
            See how small usability tweaks lead to significant increases in phone calls and enquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Apex Plumbing */}
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-charcoal-900 text-base">Apex Plumbing & Heating</h3>
                <p className="text-xs text-charcoal-500">Local emergency trades contractor</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-lime-subtle text-charcoal-900 border border-lime-muted">
                +42% Phone Inquiries
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-red-50/50 p-3 rounded-xl border border-red-200 space-y-1">
                <span className="font-bold text-red-800 block">Before SiteGrow (Score: 50)</span>
                <ul className="text-red-700 space-y-1 list-disc pl-4 text-[11px]">
                  <li>Phone number was plain unclickable text</li>
                  <li>Title was 102 chars (truncated on Google)</li>
                  <li>No mobile emergency booking button</li>
                </ul>
              </div>

              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-800 block">After Fixes (Score: 68)</span>
                <ul className="text-emerald-700 space-y-1 list-disc pl-4 text-[11px]">
                  <li>Header tap-to-call link installed</li>
                  <li>Optimized local Denver title tag</li>
                  <li>Emergency booking form on homepage</li>
                </ul>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-800 hover:text-charcoal-900 hover:underline pt-1"
            >
              <span>View Apex Plumbing Case in Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Artisan Hearth Bakery */}
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-charcoal-900 text-base">Artisan Hearth Bakery</h3>
                <p className="text-xs text-charcoal-500">Boutique cafe & catering studio</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-lime-subtle text-charcoal-900 border border-lime-muted">
                +31% Catering Bookings
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200 space-y-1">
                <span className="font-bold text-amber-900 block">Before SiteGrow (Score: 74)</span>
                <ul className="text-amber-800 space-y-1 list-disc pl-4 text-[11px]">
                  <li>No OpenGraph preview when shared</li>
                  <li>Missing canonical tag splitting traffic</li>
                  <li>Catering enquiry form buried in footer</li>
                </ul>
              </div>

              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-800 block">After Fixes (Score: 86)</span>
                <ul className="text-emerald-700 space-y-1 list-disc pl-4 text-[11px]">
                  <li>Branded social preview image added</li>
                  <li>Canonical tag declared</li>
                  <li>Hero catering CTA button placed</li>
                </ul>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-800 hover:text-charcoal-900 hover:underline pt-1"
            >
              <span>View Artisan Hearth Case in Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 5. Pricing Plans */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">Transparent Pricing</span>
          <h2 className="text-3xl font-extrabold text-charcoal-900 tracking-tight font-display">
            Simple plans for growing businesses & agencies
          </h2>
          <p className="text-sm text-charcoal-600">
            Start with our full-featured starter audit. Upgrade when you need automated re-auditing or white-label client PDF reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* Free Starter */}
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-charcoal-900 text-lg">Starter</h3>
                <p className="text-xs text-charcoal-500 mt-1">For single small business websites</p>
              </div>
              <div className="text-3xl font-black text-charcoal-900 font-display">
                $0 <span className="text-xs text-charcoal-500 font-normal">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-charcoal-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1 Website audit</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>All 14 technical & enquiry checks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Prioritized action list with code fixes</span>
                </li>
                <li className="flex items-center gap-2 text-charcoal-400">
                  <span className="w-4 h-4 text-center">—</span>
                  <span>Automated weekly scans</span>
                </li>
              </ul>
            </div>

            <Link
              href="/audit"
              className="w-full py-2.5 text-center text-xs font-bold bg-surface-warm border border-border rounded-xl text-charcoal-800 hover:bg-surface-subtle transition-all"
            >
              Start Free Audit
            </Link>
          </div>

          {/* Growth Pro (Highlighted) */}
          <div className="bg-surface rounded-2xl p-6 border-2 border-charcoal-900 shadow-dropdown relative flex flex-col justify-between space-y-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-lime-brand text-charcoal-900 text-[10px] font-extrabold uppercase tracking-wider border border-charcoal-900">
              Most Popular
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-charcoal-900 text-lg">Growth Pro</h3>
                <p className="text-xs text-charcoal-500 mt-1">For growing local businesses & freelancers</p>
              </div>
              <div className="text-3xl font-black text-charcoal-900 font-display">
                $39 <span className="text-xs text-charcoal-500 font-normal">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-charcoal-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Up to 5 tracked websites</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Weekly automated re-auditing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>PDF & Print exportable reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Historical trajectory progress charts</span>
                </li>
              </ul>
            </div>

            <Link
              href="/audit"
              className="w-full py-2.5 text-center text-xs font-bold bg-charcoal-900 text-white rounded-xl hover:bg-charcoal-800 transition-all shadow-subtle"
            >
              Get Started with Pro
            </Link>
          </div>

          {/* Agency Studio */}
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-charcoal-900 text-lg">Agency Studio</h3>
                <p className="text-xs text-charcoal-500 mt-1">For web design & SEO agencies</p>
              </div>
              <div className="text-3xl font-black text-charcoal-900 font-display">
                $99 <span className="text-xs text-charcoal-500 font-normal">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-charcoal-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited website audits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>White-label PDF reports with your agency logo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Markdown task list export for developers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Priority crawler speed & SLA</span>
                </li>
              </ul>
            </div>

            <Link
              href="/settings"
              className="w-full py-2.5 text-center text-xs font-bold bg-surface-warm border border-border rounded-xl text-charcoal-800 hover:bg-surface-subtle transition-all"
            >
              Explore Agency Settings
            </Link>
          </div>

        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section className="bg-surface rounded-2xl p-8 sm:p-12 border border-border space-y-6 max-w-4xl mx-auto">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-charcoal-900">Frequently Asked Questions</h2>
          <p className="text-xs text-charcoal-500">Everything you need to know about SiteGrow audits</p>
        </div>

        <div className="divide-y divide-border text-xs space-y-4 pt-2">
          <div className="pt-4 space-y-1.5">
            <h4 className="font-bold text-charcoal-900 text-sm">Do I need to install any tracking code on my website?</h4>
            <p className="text-charcoal-600 leading-relaxed">
              No. SiteGrow functions as an external health crawler. It analyzes your public HTML document, responsive meta tags, 
              phone click-to-call links, and server headers from the perspective of an actual visitor.
            </p>
          </div>

          <div className="pt-4 space-y-1.5">
            <h4 className="font-bold text-charcoal-900 text-sm">How does SiteGrow differ from generic PageSpeed or SEO tools?</h4>
            <p className="text-charcoal-600 leading-relaxed">
              Generic tools give you raw technical jargon (like "reduce unused CSS by 12KB") without explaining why you aren't getting customer phone calls. 
              SiteGrow is built around <strong>Enquiry Readiness</strong>: verifying tap-to-call links, contact form visibility, mobile viewport scaling, and clear local H1 headlines.
            </p>
          </div>

          <div className="pt-4 space-y-1.5">
            <h4 className="font-bold text-charcoal-900 text-sm">Are the audit results real or simulated?</h4>
            <p className="text-charcoal-600 leading-relaxed">
              Every technical check (title length, meta descriptions, image alt attributes, HTTPS, viewport, server TTFB latency, tap-to-call links) is 
              <strong> genuinely fetched and measured</strong>. We clearly label estimates and never invent fake metrics.
            </p>
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA Banner */}
      <section className="bg-charcoal-900 rounded-2xl p-8 sm:p-12 text-center text-white space-y-6 shadow-dropdown">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
            Ready to increase your website enquiries?
          </h2>
          <p className="text-sm text-charcoal-300 leading-relaxed">
            Run your first audit right now. It takes less than 10 seconds and doesn’t require a credit card or sign-up.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/audit"
            className="px-6 py-3 rounded-xl font-bold text-sm bg-lime-brand text-charcoal-900 hover:bg-lime-hover shadow-subtle hover:shadow-limeGlow transition-all duration-150 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-charcoal-900/10" />
            <span>Audit Your Website Now</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl font-bold text-sm bg-charcoal-800 text-white hover:bg-charcoal-700 border border-charcoal-700 transition-all"
          >
            Explore Dashboard Demo
          </Link>
        </div>
      </section>

    </div>
  );
}

