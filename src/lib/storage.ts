import { AuditResult, AuditRecommendation, IssueStatus, UserSettings } from '@/types';
import { SAMPLE_AUDITS, DEFAULT_USER_SETTINGS } from './sampleData';

const STORAGE_KEYS = {
  AUDITS: 'sitegrow_audits_v1',
  ACTIVE_AUDIT_ID: 'sitegrow_active_audit_id_v1',
  SETTINGS: 'sitegrow_settings_v1',
};

export function getStoredAudits(): AuditResult[] {
  if (typeof window === 'undefined') return SAMPLE_AUDITS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDITS);
    if (!raw) {
      // Seed with sample audits
      localStorage.setItem(STORAGE_KEYS.AUDITS, JSON.stringify(SAMPLE_AUDITS));
      return SAMPLE_AUDITS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SAMPLE_AUDITS;
  } catch (err) {
    console.error('Failed reading audits from localStorage:', err);
    return SAMPLE_AUDITS;
  }
}

export function saveAudit(audit: AuditResult): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredAudits();
    // Prepend new audit, or update existing if matches ID
    const index = existing.findIndex(a => a.id === audit.id);
    let updated: AuditResult[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = audit;
    } else {
      updated = [audit, ...existing];
    }
    localStorage.setItem(STORAGE_KEYS.AUDITS, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_AUDIT_ID, audit.id);
  } catch (err) {
    console.error('Failed saving audit to localStorage:', err);
  }
}

export function getActiveAudit(): AuditResult {
  const audits = getStoredAudits();
  if (typeof window === 'undefined') return audits[0] || SAMPLE_AUDITS[0];
  try {
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_AUDIT_ID);
    if (activeId) {
      const found = audits.find(a => a.id === activeId);
      if (found) return found;
    }
  } catch {
    // fallback
  }
  return audits[0] || SAMPLE_AUDITS[0];
}

export function setActiveAuditId(auditId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_AUDIT_ID, auditId);
  } catch (err) {
    console.error('Failed setting active audit ID:', err);
  }
}

export function updateRecommendationStatus(
  auditId: string,
  recommendationId: string,
  newStatus: IssueStatus
): AuditResult | null {
  const audits = getStoredAudits();
  const targetAudit = audits.find(a => a.id === auditId);
  if (!targetAudit) return null;

  const recIndex = targetAudit.recommendations.findIndex(r => r.id === recommendationId);
  if (recIndex === -1) return null;

  const updatedRecs = [...targetAudit.recommendations];
  updatedRecs[recIndex] = {
    ...updatedRecs[recIndex],
    status: newStatus,
  };

  // Recalculate health score if items are resolved
  const resolvedCount = updatedRecs.filter(r => r.status === 'resolved').length;
  const initialResolved = targetAudit.recommendations.filter(r => r.status === 'resolved').length;
  const deltaResolved = resolvedCount - initialResolved;

  // Each resolved recommendation recovers a share of impact
  const initialBase = targetAudit.previousScore ?? Math.max(35, targetAudit.overallScore - 8);
  const resolvedPoints = updatedRecs
    .filter(r => r.status === 'resolved')
    .reduce((acc, curr) => acc + Math.round(curr.impactScore * 0.6), 0);

  const newOverall = Math.min(100, Math.max(30, initialBase + resolvedPoints));

  // Dynamically update corresponding pillar scores
  const updatedPillars = { ...targetAudit.pillars };
  for (const cat of ['conversion', 'seo', 'usability', 'performance'] as const) {
    if (targetAudit.pillars[cat]) {
      const catRecs = updatedRecs.filter(r => r.category === cat);
      if (catRecs.length > 0) {
        const catResolved = catRecs.filter(r => r.status === 'resolved').length;
        const catRatio = catResolved / catRecs.length;
        const initialPillar = targetAudit.pillars[cat].score;
        updatedPillars[cat] = {
          ...targetAudit.pillars[cat],
          score: Math.min(100, Math.max(30, Math.round(initialPillar + (100 - initialPillar) * catRatio * 0.4))),
        };
      }
    }
  }

  const updatedAudit: AuditResult = {
    ...targetAudit,
    overallScore: newOverall,
    pillars: updatedPillars,
    recommendations: updatedRecs,
  };

  saveAudit(updatedAudit);
  return updatedAudit;
}

export function getUserSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_USER_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_USER_SETTINGS;
    return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_USER_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed saving settings to localStorage:', err);
  }
}

