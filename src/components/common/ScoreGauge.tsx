import React from 'react';
import { getScoreBadgeColor } from '@/lib/utils';
import { TrendingUp, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  industryAverage?: number;
  subtitle?: string;
  showBenchmark?: boolean;
}

export function ScoreGauge({
  score,
  size = 'md',
  industryAverage = 67,
  subtitle,
  showBenchmark = true,
}: ScoreGaugeProps) {
  const badge = getScoreBadgeColor(score);
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Arc calculation (fill from 0 to 100%)
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const diff = score - industryAverage;
  const diffSign = diff >= 0 ? `+${diff}` : `${diff}`;

  let colorClass = 'stroke-lime-brand';
  if (score < 50) colorClass = 'stroke-red-500';
  else if (score < 75) colorClass = 'stroke-amber-400';
  else if (score >= 90) colorClass = 'stroke-emerald-500';

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative inline-flex items-center justify-center">
        <svg
          className="transform -rotate-90"
          width={size === 'sm' ? 120 : size === 'lg' ? 190 : 160}
          height={size === 'sm' ? 120 : size === 'lg' ? 190 : 160}
          viewBox="0 0 160 160"
        >
          {/* Background circle track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-surface-subtle"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight font-display">
            {score}
          </span>
          <span className="text-[11px] font-medium text-charcoal-500 uppercase tracking-wider -mt-0.5">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text} border ${badge.border}`}
        >
          {score >= 75 ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5" />
          )}
          {badge.label}
        </span>
      </div>

      {subtitle && (
        <p className="text-xs text-charcoal-500 mt-2 max-w-[200px] leading-relaxed">
          {subtitle}
        </p>
      )}

      {showBenchmark && (
        <div className="mt-2 text-[11px] text-charcoal-500 flex items-center gap-1">
          <span>vs Small Business avg ({industryAverage}):</span>
          <span
            className={`font-semibold ${
              diff >= 0 ? 'text-emerald-700' : 'text-red-600'
            }`}
          >
            {diffSign} pts
          </span>
        </div>
      )}
    </div>
  );
}

