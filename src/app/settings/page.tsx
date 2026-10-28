'use client';

import React, { useState, useEffect } from 'react';
import { UserSettings } from '@/types';
import { getUserSettings, saveUserSettings } from '@/lib/storage';
import { 
  Building, 
  Mail, 
  Globe, 
  Sliders, 
  ShieldCheck, 
  Palette, 
  Trash2, 
  Check, 
  Save, 
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(getUserSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const s = getUserSettings();
    setSettings(s);
    setMounted(true);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetData = () => {
    if (typeof window !== 'undefined') {
      if (confirm('Are you sure you want to reset your audits back to default sample data?')) {
        localStorage.clear();
        setResetSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    }
  };

  if (!mounted) {
    return (
      <div className="py-20 text-center text-xs text-charcoal-500">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
          Preferences & Configuration
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight font-display">
          SiteGrow Account & Audit Settings
        </h1>
        <p className="text-xs text-charcoal-500 mt-1">
          Configure your business profile, automated crawl frequency, and agency report white-label branding.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* 1. Business Profile */}
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-card space-y-6">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-charcoal-700" />
            <h2 className="text-base font-bold text-charcoal-900">Business Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-charcoal-700">Company / Business Name</label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-charcoal-900 font-medium focus:outline-none focus:ring-2 focus:ring-lime-brand"
                placeholder="e.g. Apex Growth Studio"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-charcoal-700">Primary Website URL</label>
              <input
                type="text"
                value={settings.websiteUrl}
                onChange={(e) => setSettings({ ...settings, websiteUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-charcoal-900 font-medium focus:outline-none focus:ring-2 focus:ring-lime-brand"
                placeholder="https://apexplumbing-demo.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-charcoal-700">Notification Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-charcoal-900 font-medium focus:outline-none focus:ring-2 focus:ring-lime-brand"
                placeholder="alex@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-charcoal-700">Industry / Vertical</label>
              <select
                value={settings.industry}
                onChange={(e) => setSettings({ ...settings, industry: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-charcoal-900 font-medium focus:outline-none focus:ring-2 focus:ring-lime-brand cursor-pointer"
              >
                <option value="Home Services & Contractors">Home Services & Contractors (Plumbing, HVAC, Roofers)</option>
                <option value="Healthcare & Wellness">Healthcare & Wellness (Dental, Clinics, Physio)</option>
                <option value="Legal & Professional">Legal & Professional Services (Law, Accounting)</option>
                <option value="Hospitality & Dining">Hospitality & Dining (Cafes, Restaurants, Catering)</option>
                <option value="Freelancer & Creative Studio">Freelancer & Creative Studio (Design, Web)</option>
                <option value="E-Commerce & Retail">E-Commerce & Retail</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Audit & Schedule Configuration */}
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-card space-y-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-charcoal-700" />
            <h2 className="text-base font-bold text-charcoal-900">Audit & Crawling Engine Settings</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-charcoal-700">Automated Re-Audit Frequency</label>
              <select
                value={settings.automatedScanFrequency}
                onChange={(e) => setSettings({ ...settings, automatedScanFrequency: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-charcoal-900 font-medium focus:outline-none focus:ring-2 focus:ring-lime-brand cursor-pointer"
              >
                <option value="weekly">Every Week (Recommended for active sites)</option>
                <option value="biweekly">Every 2 Weeks</option>
                <option value="monthly">Monthly Snapshot</option>
                <option value="disabled">Manual Only (No automated scans)</option>
              </select>
              <p className="text-[11px] text-charcoal-500">
                SiteGrow re-crawls your homepage on schedule to log score improvements.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-charcoal-700">Crawl Depth Scope</label>
              <select
                value={settings.scanDepth}
                onChange={(e) => setSettings({ ...settings, scanDepth: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-charcoal-900 font-medium focus:outline-none focus:ring-2 focus:ring-lime-brand cursor-pointer"
              >
                <option value="quick">Quick Scan (Homepage HTML & Conversion Triggers)</option>
                <option value="deep">Deep DOM Scan (Full Heading Tree & Assets)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-charcoal-900 block">Critical Drop Email Alerts</span>
              <span className="text-[11px] text-charcoal-500">Send an instant alert if SSL expires or response latency exceeds 2 seconds</span>
            </div>
            <input
              type="checkbox"
              checked={settings.enableEmailAlerts}
              onChange={(e) => setSettings({ ...settings, enableEmailAlerts: e.target.checked })}
              className="w-4 h-4 text-charcoal-900 rounded border-border focus:ring-lime-brand cursor-pointer"
            />
          </div>
        </div>

        {/* 3. Agency White-label Settings */}
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-charcoal-700" />
              <div>
                <h2 className="text-base font-bold text-charcoal-900">Agency White-Label Branding</h2>
                <p className="text-xs text-charcoal-500">Add your agency name and details to printable client reports</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.agencyMode}
              onChange={(e) => setSettings({ ...settings, agencyMode: e.target.checked })}
              className="w-4 h-4 text-charcoal-900 rounded border-border focus:ring-lime-brand cursor-pointer"
            />
          </div>

          {settings.agencyMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Agency Brand Name</label>
                <input
                  type="text"
                  value={settings.agencyName || ''}
                  onChange={(e) => setSettings({ ...settings, agencyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-charcoal-900 font-medium focus:outline-none focus:ring-2 focus:ring-lime-brand"
                  placeholder="e.g. Horizon Digital Studio"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-charcoal-700">Accent Brand Color (Hex)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={settings.accentBrandColor || '#D2FC36'}
                    onChange={(e) => setSettings({ ...settings, accentBrandColor: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-surface text-charcoal-900 font-mono focus:outline-none focus:ring-2 focus:ring-lime-brand"
                  />
                  <div
                    className="w-10 h-10 rounded-xl border border-border shrink-0 shadow-subtle"
                    style={{ backgroundColor: settings.accentBrandColor || '#D2FC36' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Local Persistence & Reset */}
        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-card space-y-4">
          <div className="flex items-center gap-2 text-charcoal-900">
            <Trash2 className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-bold">Data & Persistence Management</h2>
          </div>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            All audits, recommendation task statuses, and settings are saved locally in your browser’s persistent storage. 
            You can reset back to default verified sample businesses at any time.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Audits to Default Sample Scenarios</span>
            </button>
            {resetSuccess && (
              <span className="text-xs text-emerald-700 font-semibold ml-3">
                Resetting data...
              </span>
            )}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-4">
          <div>
            {savedSuccess && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>Preferences saved successfully!</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-lime-brand text-charcoal-900 hover:bg-lime-hover shadow-subtle hover:shadow-limeGlow transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
}

