'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Search, 
  CheckSquare, 
  FileText, 
  Settings, 
  Sparkles, 
  Menu, 
  X, 
  ShieldCheck,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/audit', label: 'New Audit', icon: Search },
    { href: '/recommendations', label: 'Recommendations', icon: CheckSquare },
    { href: '/reports', label: 'Reports', icon: FileText },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const isCurrent = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FBFBFA]/90 backdrop-blur-md border-b border-border print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-charcoal-900 flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform duration-200">
                <div className="relative">
                  <TrendingUp className="w-5 h-5 text-lime-brand stroke-[2.5]" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-lime-brand animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-charcoal-900 tracking-tight flex items-center gap-1.5">
                  SiteGrow
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-lime-subtle text-charcoal-800 border border-lime-muted">
                    SaaS
                  </span>
                </span>
                <span className="text-[11px] text-charcoal-500 font-medium -mt-1 hidden sm:block">
                  Website Growth Assistant
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active = isCurrent(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      active
                        ? 'bg-charcoal-900 text-white shadow-subtle'
                        : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-surface-warm'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-lime-brand' : 'text-charcoal-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-lime-brand text-charcoal-900 hover:bg-lime-hover shadow-subtle transition-all duration-150 hover:shadow-limeGlow"
            >
              <Sparkles className="w-4 h-4 fill-charcoal-900/10" />
              <span>Audit a Website</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/audit"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-lime-brand text-charcoal-900"
            >
              Audit
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal-600 hover:text-charcoal-900 hover:bg-surface-warm"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 pt-2 pb-4 space-y-1 shadow-dropdown animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isCurrent(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-charcoal-900 text-white'
                    : 'text-charcoal-700 hover:bg-surface-warm'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-lime-brand' : 'text-charcoal-500'}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

