'use client';

import React, { useState } from 'react';
import { HistoricalAuditPoint } from '@/types';
import { TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';

interface HistoricalChartProps {
  data: HistoricalAuditPoint[];
  siteName: string;
}

export function HistoricalChart({ data, siteName }: HistoricalChartProps) {
  const [activeMetric, setActiveMetric] = useState<
    'overallScore' | 'conversionScore' | 'seoScore' | 'usabilityScore' | 'performanceScore'
  >('overallScore');

  const [hoveredPoint, setHoveredPoint] = useState<HistoricalAuditPoint | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-surface rounded-xl p-6 border border-border text-center text-charcoal-500 text-sm">
        <p>No historical audit points recorded yet for this website.</p>
      </div>
    );
  }

  // Calculate coordinates for SVG
  const width = 600;
  const height = 200;
  const paddingX = 40;
  const paddingY = 30;

  const minScore = 30;
  const maxScore = 100;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * (width - 2 * paddingX);
    const scoreVal = d[activeMetric];
    const y = height - paddingY - ((scoreVal - minScore) / (maxScore - minScore)) * (height - 2 * paddingY);
    return { x, y, point: d, val: scoreVal };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Fill area under the curve
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const areaD = firstPoint && lastPoint
    ? `${pathD} L ${lastPoint.x} ${height - paddingY} L ${firstPoint.x} ${height - paddingY} Z`
    : '';

  const firstScore = data[0]?.[activeMetric] ?? 0;
  const lastScore = data[data.length - 1]?.[activeMetric] ?? 0;
  const netGain = lastScore - firstScore;

  const metricLabels = {
    overallScore: 'Overall Health Score',
    conversionScore: 'Enquiry Readiness',
    seoScore: 'Search & SEO',
    usabilityScore: 'Mobile Usability',
    performanceScore: 'Speed & Tech Health',
  };

  return (
    <div className="bg-surface rounded-xl p-6 border border-border shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-charcoal-900 text-base">Growth Trajectory Over Time</h3>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-lime-subtle text-charcoal-900 border border-lime-muted">
              <TrendingUp className="w-3 h-3 text-lime-dark" />
              {netGain >= 0 ? `+${netGain}` : netGain} pts
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Audit history for {siteName} across recent scans
          </p>
        </div>

        {/* Metric Selector Pills */}
        <div className="flex items-center gap-1 bg-surface-warm p-1 rounded-lg border border-border text-xs">
          {(
            [
              ['overallScore', 'Overall'],
              ['conversionScore', 'Enquiries'],
              ['seoScore', 'SEO'],
              ['usabilityScore', 'Mobile'],
              ['performanceScore', 'Speed'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveMetric(key)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                activeMetric === key
                  ? 'bg-charcoal-900 text-white shadow-subtle'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 sm:h-56 overflow-visible"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D2FC36" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#D2FC36" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[40, 60, 80, 100].map((level) => {
            const y = height - paddingY - ((level - minScore) / (maxScore - minScore)) * (height - 2 * paddingY);
            return (
              <g key={level}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#EDEDE6"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-charcoal-400 font-mono"
                >
                  {level}
                </text>
              </g>
            );
          })}

          {/* Filled Area */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#1A1B20"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="5"
                className="fill-lime-brand stroke-charcoal-900 stroke-2 cursor-pointer hover:r-7 transition-all"
                onMouseEnter={() => setHoveredPoint(pt.point)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <text
                x={pt.x}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] fill-charcoal-500 font-medium"
              >
                {pt.point.date}
              </text>
            </g>
          ))}
        </svg>

        {/* Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 bg-charcoal-900 text-white px-3 py-1.5 rounded-lg text-xs shadow-dropdown flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-lime-brand" />
            <span>{hoveredPoint.date}:</span>
            <span className="font-bold text-lime-brand">
              {hoveredPoint[activeMetric]} / 100
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between text-xs text-charcoal-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-lime-brand border border-charcoal-900 inline-block"></span>
          Showing {metricLabels[activeMetric]}
        </span>
        <span>
          Baseline: <strong>{firstScore}</strong> → Latest: <strong>{lastScore}</strong>
        </span>
      </div>
    </div>
  );
}
