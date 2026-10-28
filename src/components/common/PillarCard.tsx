import React from 'react';
import { PillarScore } from '@/types';
import { PhoneCall, Search, Smartphone, Zap } from 'lucide-react';

interface PillarCardProps {
  type: 'conversion' | 'seo' | 'usability' | 'performance';
  pillar: PillarScore;
  onClick?: () => void;
}

export function PillarCard({ type, pillar, onClick }: PillarCardProps) {
  const meta = {
    conversion: {
      title: 'Enquiry Readiness',
      subtitle: 'Click-to-call, forms, CTAs',
      icon: PhoneCall,
      accent: 'border-l-lime-brand',
    },
    seo: {
      title: 'Search & Metadata',
      subtitle: 'Titles, meta tags, H1 structure',
      icon: Search,
      accent: 'border-l-charcoal-700',
    },
    usability: {
      title: 'Mobile Experience',
      subtitle: 'Viewport, image alt tags, layout',
      icon: Smartphone,
      accent: 'border-l-blue-500',
    },
    performance: {
      title: 'Speed & Security',
      subtitle: 'TTFB latency, HTML size, HTTPS',
      icon: Zap,
      accent: 'border-l-emerald-500',
    },
  }[type];

  const Icon = meta.icon;

  let scoreColor = 'text-charcoal-900';
  let barColor = 'bg-lime-brand';
  if (pillar.score < 50) {
    scoreColor = 'text-red-600';
    barColor = 'bg-red-500';
  } else if (pillar.score < 75) {
    scoreColor = 'text-amber-600';
    barColor = 'bg-amber-400';
  } else if (pillar.score >= 90) {
    scoreColor = 'text-emerald-700';
    barColor = 'bg-emerald-500';
  }

  return (
    <div 
      onClick={onClick}
      className={`bg-surface rounded-xl p-5 border border-border shadow-card hover:shadow-dropdown transition-all duration-200 border-l-4 ${meta.accent} flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-warm flex items-center justify-center text-charcoal-700">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-charcoal-900 text-sm">{meta.title}</h3>
              <p className="text-[11px] text-charcoal-500">{meta.subtitle}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-bold font-display ${scoreColor}`}>
              {pillar.score}
            </span>
            <span className="text-[11px] text-charcoal-400 block -mt-1">/ 100</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-surface-subtle h-2 rounded-full mt-4 overflow-hidden">
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-700`}
            style={{ width: `${pillar.score}%` }}
          />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
        <span className="text-charcoal-500 font-medium">
          {pillar.passedCount} of {pillar.totalChecks} checks passed
        </span>
        <span className="text-[11px] text-charcoal-600 font-semibold truncate max-w-[150px] text-right" title={pillar.statusText}>
          {pillar.statusText}
        </span>
      </div>
    </div>
  );
}

