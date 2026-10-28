'use client';

import React, { useState } from 'react';
import { AuditResult, AuditRecommendation, IssueStatus, IssueCategory, Severity } from '@/types';
import { SeverityBadge } from '../common/SeverityBadge';
import { 
  Filter, 
  Search, 
  CheckCircle2, 
  Clock, 
  CircleDot, 
  Copy, 
  Check, 
  Code2, 
  Lightbulb, 
  AlertCircle, 
  FileSpreadsheet,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface RecommendationsBoardProps {
  audit: AuditResult;
  onUpdateStatus: (recId: string, status: IssueStatus) => void;
}

export function RecommendationsBoard({ audit, onUpdateStatus }: RecommendationsBoardProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [exportCopied, setExportCopied] = useState(false);

  const recommendations = audit.recommendations;

  // Filter recommendations
  const filtered = recommendations.filter((rec) => {
    if (categoryFilter !== 'all' && rec.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && rec.status !== statusFilter) return false;
    if (severityFilter !== 'all') {
      if (severityFilter === 'high') {
        if (rec.severity !== 'critical' && rec.severity !== 'high') return false;
      } else if (rec.severity !== severityFilter) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = rec.title.toLowerCase().includes(q);
      const matchWhat = rec.whatIsIt.toLowerCase().includes(q);
      const matchWhy = rec.whyItMatters.toLowerCase().includes(q);
      const matchHow = rec.howToFix.toLowerCase().includes(q);
      if (!matchTitle && !matchWhat && !matchWhy && !matchHow) return false;
    }
    return true;
  });

  const totalOpen = recommendations.filter(r => r.status === 'open').length;
  const totalInProgress = recommendations.filter(r => r.status === 'in_progress').length;
  const totalResolved = recommendations.filter(r => r.status === 'resolved').length;

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleExportMarkdown = () => {
    const mdLines = [
      `# SiteGrow Action Plan for ${audit.siteName} (${audit.cleanUrl})`,
      `Audited: ${new Date(audit.timestamp).toLocaleDateString()}`,
      `Overall Score: ${audit.overallScore}/100\n`,
      `## Prioritized Growth Fixes\n`,
    ];

    recommendations.forEach((r, idx) => {
      mdLines.push(`### ${idx + 1}. [${r.severity.toUpperCase()}] ${r.title}`);
      mdLines.push(`- **Status:** ${r.status}`);
      mdLines.push(`- **Category:** ${r.category}`);
      mdLines.push(`- **Impact:** +${r.impactScore} points`);
      mdLines.push(`- **What it is:** ${r.whatIsIt}`);
      mdLines.push(`- **Why it matters:** ${r.whyItMatters}`);
      mdLines.push(`- **How to fix:** ${r.howToFix}`);
      if (r.codeSnippet) {
        mdLines.push(`\n\`\`\`html\n${r.codeSnippet}\n\`\`\`\n`);
      }
      mdLines.push('\n---\n');
    });

    navigator.clipboard.writeText(mdLines.join('\n'));
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Stats Bar */}
      <div className="bg-surface rounded-2xl p-6 border border-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-lime-subtle text-charcoal-900 border border-lime-muted inline-flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3 h-3 text-lime-dark" />
            <span>Interactive Action Tracker</span>
          </span>
          <h2 className="text-xl font-bold text-charcoal-900">
            Growth Recommendations for {audit.siteName}
          </h2>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Mark items as in-progress or resolved as you implement them to track your score gains.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-surface-warm px-3.5 py-2 rounded-xl border border-border text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-charcoal-700">
              <CircleDot className="w-4 h-4 text-red-500" />
              <span>{totalOpen} Open</span>
            </div>
            <span className="text-charcoal-300">•</span>
            <div className="flex items-center gap-1.5 font-semibold text-amber-700">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{totalInProgress} In Progress</span>
            </div>
            <span className="text-charcoal-300">•</span>
            <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{totalResolved} Resolved</span>
            </div>
          </div>

          <button
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-surface border border-border text-charcoal-800 hover:bg-surface-warm hover:border-charcoal-400 transition-all cursor-pointer"
          >
            {exportCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Markdown Copied!</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4 text-charcoal-500" />
                <span>Copy as Task List</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface rounded-xl p-4 border border-border shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search issues, code snippets, or CMS guides..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-surface text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:ring-1 focus:ring-charcoal-900"
            />
          </div>

          {/* Quick Filter selectors */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-surface border border-border rounded-lg px-2.5 py-1.5 font-medium text-charcoal-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="conversion">Enquiry & Conversion</option>
              <option value="seo">Search & SEO</option>
              <option value="usability">Mobile Usability</option>
              <option value="performance">Speed & Performance</option>
              <option value="security">Security & HTTPS</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface border border-border rounded-lg px-2.5 py-1.5 font-medium text-charcoal-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open Only</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-surface border border-border rounded-lg px-2.5 py-1.5 font-medium text-charcoal-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="high">Critical & High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* Recommendations Cards List */}
      {filtered.length === 0 ? (
        <div className="bg-surface rounded-2xl p-12 text-center border border-border">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-charcoal-900">No matching recommendations found</h3>
          <p className="text-xs text-charcoal-500 mt-1">
            Try adjusting your search query or reset your filters to view all recommendations.
          </p>
          <button
            onClick={() => {
              setCategoryFilter('all');
              setStatusFilter('all');
              setSeverityFilter('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold bg-surface-warm text-charcoal-800 rounded-lg border border-border hover:bg-surface-subtle"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((rec) => {
            const isResolved = rec.status === 'resolved';
            const isInProgress = rec.status === 'in_progress';

            return (
              <div
                key={rec.id}
                id={rec.id}
                className={`bg-surface rounded-2xl p-6 border transition-all duration-200 shadow-card ${
                  isResolved
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-border hover:border-charcoal-300'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-border-subtle">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <SeverityBadge severity={rec.severity} size="md" />
                      <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 px-2 py-0.5 rounded bg-surface-warm border border-border">
                        {rec.category}
                      </span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Estimated +{rec.impactScore} pts
                      </span>
                    </div>

                    <h3 className={`text-base sm:text-lg font-bold ${
                      isResolved ? 'line-through text-charcoal-500' : 'text-charcoal-900'
                    }`}>
                      {rec.title}
                    </h3>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-xs font-semibold text-charcoal-500 hidden sm:block">Status:</label>
                    <select
                      value={rec.status}
                      onChange={(e) => onUpdateStatus(rec.id, e.target.value as IssueStatus)}
                      className={`text-xs font-bold rounded-lg px-3 py-1.5 border transition-all cursor-pointer ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isInProgress
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-surface-warm text-charcoal-800 border-border hover:border-charcoal-400'
                      }`}
                    >
                      <option value="open">⭕ Open</option>
                      <option value="in_progress">⏳ In Progress</option>
                      <option value="resolved">✅ Resolved</option>
                    </select>
                  </div>
                </div>

                {/* 3-Section Breakdown: What it is, Why it matters, How to fix it */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
                  
                  {/* Column 1: What is the issue */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-charcoal-500" />
                      <span>What the issue is</span>
                    </h4>
                    <p className="text-xs text-charcoal-600 leading-relaxed">
                      {rec.whatIsIt}
                    </p>
                    {rec.evidence && (
                      <div className="mt-2 text-[11px] text-charcoal-500 font-mono bg-surface-warm p-2 rounded border border-border">
                        <strong>Evidence:</strong> {rec.evidence}
                      </div>
                    )}
                  </div>

                  {/* Column 2: Why it matters */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      <span>Why it matters to business</span>
                    </h4>
                    <p className="text-xs text-charcoal-600 leading-relaxed">
                      {rec.whyItMatters}
                    </p>
                  </div>

                  {/* Column 3: How to fix it */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>How to fix it</span>
                    </h4>
                    <p className="text-xs text-charcoal-600 leading-relaxed">
                      {rec.howToFix}
                    </p>
                    {rec.cmsGuide && (
                      <p className="text-[11px] text-charcoal-500 bg-surface-subtle/50 p-2 rounded border border-border-subtle leading-normal">
                        <strong>Platform tip:</strong> {rec.cmsGuide}
                      </p>
                    )}
                  </div>

                </div>

                {/* Code Snippet Box (if available) */}
                {rec.codeSnippet && (
                  <div className="mt-5 pt-4 border-t border-border-subtle">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-charcoal-500 flex items-center gap-1 font-mono">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Recommended Code / Implementation</span>
                      </span>
                      <button
                        onClick={() => handleCopyCode(rec.id, rec.codeSnippet!)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-charcoal-700 hover:text-charcoal-900 bg-surface-warm px-2 py-0.5 rounded border border-border transition-colors cursor-pointer"
                      >
                        {copiedSnippetId === rec.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy snippet</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="bg-charcoal-900 text-charcoal-100 p-3.5 rounded-xl text-xs font-mono overflow-x-auto selection:bg-lime-brand selection:text-charcoal-900">
                      <code>{rec.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

