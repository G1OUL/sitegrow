import React from 'react';
import Link from 'next/link';
import { TrendingUp, ShieldCheck, HelpCircle, ExternalLink, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-surface-warm border-t border-border mt-20 print:hidden text-sm text-charcoal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-charcoal-900 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-lime-brand" />
              </div>
              <span className="font-bold text-charcoal-900 text-base">SiteGrow</span>
            </div>
            <p className="text-xs text-charcoal-500 leading-relaxed">
              Empowering small businesses, freelancers, and agencies to transform website visitors into paying customers through actionable health audits.
            </p>
            <div className="flex items-center gap-2 text-xs text-charcoal-500 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>All audit engines operational</span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-semibold text-charcoal-900 text-xs uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/audit" className="hover:text-charcoal-900 transition-colors">
                  Instant Website Audit
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-charcoal-900 transition-colors">
                  Health Score Dashboard
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="hover:text-charcoal-900 transition-colors">
                  Actionable Fix Tracker
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-charcoal-900 transition-colors">
                  Print & PDF Client Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Audit Checks */}
          <div>
            <h4 className="font-semibold text-charcoal-900 text-xs uppercase tracking-wider mb-3">Audit Scope</h4>
            <ul className="space-y-2 text-xs text-charcoal-500">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-dark"></span>
                <span>Tap-to-Call & Enquiry Form Detection</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-dark"></span>
                <span>Mobile Viewport & Accessibility</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-dark"></span>
                <span>H1, Title & Meta Description Tags</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-dark"></span>
                <span>Response Latency (TTFB) & HTTPS</span>
              </li>
            </ul>
          </div>

          {/* Trust & Transparency */}
          <div>
            <h4 className="font-semibold text-charcoal-900 text-xs uppercase tracking-wider mb-3">Transparency</h4>
            <div className="bg-surface p-3.5 rounded-lg border border-border space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-charcoal-800 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Honest Audit Standards</span>
              </div>
              <p className="text-[11px] text-charcoal-500 leading-normal">
                SiteGrow clearly distinguishes real measured checks from algorithmic estimates. We never invent fake metrics.
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-400">
          <p>© {new Date().getFullYear()} SiteGrow SaaS. Crafted for small business growth.</p>
          <div className="flex items-center gap-6">
            <Link href="/settings" className="hover:text-charcoal-700">Settings & Demo Mode</Link>
            <span className="text-charcoal-300">•</span>
            <span className="text-charcoal-500">Fast, SSRF-safe automated crawler</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

