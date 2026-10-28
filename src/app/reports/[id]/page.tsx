'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AuditResult, UserSettings } from '@/types';
import { getStoredAudits, getUserSettings } from '@/lib/storage';
import { ReportView } from '@/components/reports/ReportView';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function SingleReportPage() {
  const params = useParams();
  const id = params?.id as string;

  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [settings, setSettings] = useState<UserSettings | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const list = getStoredAudits();
    const found = list.find((a) => a.id === id || a.cleanUrl.toLowerCase() === id.toLowerCase());
    if (found) {
      setAudit(found);
    }
    const s = getUserSettings();
    setSettings(s);
    setMounted(true);
  }, [id]);

  if (!mounted) {
    return (
      <div className="py-20 text-center text-xs text-charcoal-500">
        Loading report...
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-charcoal-900">Audit Report Not Found</h2>
        <p className="text-xs text-charcoal-600 leading-relaxed">
          The requested audit ID could not be located in your browser history or demo database.
        </p>
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-charcoal-900 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Reports</span>
        </Link>
      </div>
    );
  }

  return <ReportView audit={audit} settings={settings} />;
}

