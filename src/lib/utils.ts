import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUrl(rawUrl: string): string {
  let cleaned = rawUrl.trim();
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(formatUrl(url));
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0] || url;
  }
}

export function getScoreBadgeColor(score: number): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  if (score >= 90) {
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      label: "Excellent",
    };
  }
  if (score >= 75) {
    return {
      bg: "bg-lime-subtle",
      text: "text-charcoal-900",
      border: "border-lime-brand",
      label: "Good",
    };
  }
  if (score >= 50) {
    return {
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      label: "Needs Improvement",
    };
  }
  return {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    label: "Critical Action Required",
  };
}

export function getSeverityStyle(severity: string) {
  switch (severity) {
    case "critical":
    case "high":
      return {
        bg: "bg-red-50 text-red-700 border-red-200",
        badge: "bg-red-100 text-red-800",
        indicator: "bg-red-500",
      };
    case "medium":
      return {
        bg: "bg-amber-50 text-amber-800 border-amber-200",
        badge: "bg-amber-100 text-amber-900",
        indicator: "bg-amber-500",
      };
    case "low":
      return {
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        badge: "bg-blue-100 text-blue-800",
        indicator: "bg-blue-500",
      };
    case "good":
    default:
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        badge: "bg-emerald-100 text-emerald-800",
        indicator: "bg-emerald-500",
      };
  }
}

