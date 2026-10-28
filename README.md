# SiteGrow — Website Growth & Usability Audit SaaS

> **Turn website visitors into paying business enquiries.**  
> SiteGrow is an automated website growth assistant for small businesses, freelancers, web agencies, and local service providers.

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)]()
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)]()
[![License](https://img.shields.io/badge/License-MIT-amber.svg)]()
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FG1OUL%2Fsitegrow)

---

## 📌 Project Overview

Most small businesses lose up to 60% of their prospective customer enquiries due to preventable digital friction: missing mobile tap-to-call links, buried contact forms, truncated Google search titles, and sluggish initial server response times.

**SiteGrow** audits any public website in seconds from the perspective of an incoming customer. Instead of overwhelming non-technical owners with 80 pages of confusing developer jargon, SiteGrow focuses strictly on **Enquiry Readiness**, providing prioritized, plain-English action items with copy-pasteable code fixes.

---

## 🚀 Key Features

- **Real Automated Public Crawler**: Non-destructive server-side audit engine that crawls live HTML documents and HTTP response headers.
- **SSRF & DNS Security Shield**: Pre-lookup DNS resolution and redirect hop inspection to block attacks targeting private subnets, loopback addresses, or cloud metadata endpoints.
- **Honest Metric Disclosures**: Strictly tags every check as **Live Verified**, **Calculated Estimate**, or **Requires Connected API** — no fake or fabricated lab scores.
- **4 Growth Pillars**:
  1. **Enquiry Readiness**: Click-to-call `tel:` phone links, direct contact forms, mailto links, and high-intent CTA buttons.
  2. **Search Discovery**: Title length (35-65 chars), meta descriptions, single H1 heading hierarchy, and canonical link tags.
  3. **Mobile Usability**: Responsive `width=device-width` viewport configuration and image accessibility `alt` attribute audits.
  4. **Speed & Security**: Server Time-to-First-Byte (TTFB) latency, payload weight, and HTTPS encryption.
- **Interactive Action Tracker**: Filter recommendations by category, status (*Open*, *In Progress*, *Resolved*), and priority. Resolving issues dynamically recalculates the projected health score.
- **Developer Markdown Export**: Export prioritized audit findings as a clean Markdown task list for client or developer handoffs.
- **Client-Ready PDF & Print Reports**: Dedicated `@media print` stylesheet optimized for client deliverables without UI clutter.
- **Agency White-Labeling**: Customize client reports with your agency name, accent branding color, and custom header notes.
- **Zero-Setup Demo Scenarios**: Pre-loaded with realistic small business audit profiles (*Apex Plumbing & Heating*, *Artisan Hearth Bakery*, and *Harborview Law Partners*).

---

## 💻 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.6 (Strict type safety)
- **Styling**: Tailwind CSS (Sophisticated warm off-white `#FBFBFA` palette with electric-lime `#D2FC36` accents)
- **Icons**: Lucide React
- **API Engine**: Node.js Route Handlers (`runtime: 'nodejs'`) with native DNS lookup, streaming byte limits, and redirect validation
- **State & Storage**: Client-side `localStorage` with offline fallback seed data

---

## 🖼️ User Interface & Screenshots

### 1. Growth Diagnostics Dashboard
```
+-------------------------------------------------------------------------+
| [Active Site: Apex Plumbing (Denver)]   [Re-audit]  [+ Audit New Site]   |
+------------------------------------+------------------------------------+
|  WEBSITE HEALTH SCORE              |  ISSUE SEVERITY BREAKDOWN          |
|         /=========\                |  [ 1 Critical ]  [ 1 High Impact ] |
|        |   68      |               |  [ 2 Med/Low  ]  [ 1 Resolved    ] |
|         \=========/                |                                    |
|   Good • +3 pts vs Industry Avg    |  14 Checks Conducted • 520ms TTFB  |
+------------------------------------+------------------------------------+
| [Enquiry Readiness: 60%]     [Search & SEO: 72%]                        |
| [Mobile Experience: 70%]     [Speed & Security: 75%]                    |
+-------------------------------------------------------------------------+
```

### 2. Actionable Recommendation Cards
Every recommendation provides three core answers:
1. **What the issue is** (Plain English)
2. **Why it matters to your business enquiries** (Revenue impact)
3. **How to fix it** (Step-by-step resolution + copy-pasteable HTML snippets + CMS platform guides)

---

## ⚙️ Local Installation & Setup

### Prerequisites
- Node.js `v18.17.0` or higher (Tested on Node.js `v24.15.0`)
- npm `v9.0.0` or higher (or pnpm / yarn)

### 1. Clone the Repository
```bash
git clone https://github.com/G1OUL/sitegrow.git
cd sitegrow
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables (Optional)
Copy the template configuration file:
```bash
cp .env.example .env.local
```
*(SiteGrow works out of the box with zero external API keys required).*

| Variable | Description | Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Base public URL | `http://localhost:3000` |
| `PAGESPEED_API_KEY` | Optional Google PageSpeed API key for field CrUX metrics | `""` |
| `AUDIT_TIMEOUT_MS` | Max crawl timeout in ms | `8000` |
| `AUDIT_MAX_REDIRECTS` | Max redirect hops | `4` |
| `AUDIT_MAX_PAYLOAD_BYTES` | Max downloaded HTML payload | `2097152` (2MB) |

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing Instructions

Run the full end-to-end automated test suite:
```bash
# 1. Build production bundle
npm run build

# 2. Run automated verification suite
npm test
```

The test suite automatically tests:
- All 8 application routes (`/`, `/audit`, `/dashboard`, `/recommendations`, `/reports`, `/reports/[id]`, `/settings`, `/api/audit`).
- Live public URL audit with response latency and check categorization.
- Negative test cases: invalid URL format, non-HTTP protocols, and unreachable domains.
- SSRF security defenses: loopback (`127.0.0.1`, `localhost`, `[::1]`), AWS metadata (`169.254.169.254`), and private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
- Demo mode fallback verification.

---

## 🚀 Deployment Instructions (Vercel)

SiteGrow is optimized for 1-click deployment on **Vercel**:

### Option A: Via Vercel Web Dashboard (Recommended)
1. Push your repository to GitHub at `https://github.com/G1OUL/sitegrow`.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the `G1OUL/sitegrow` repository.
4. Framework Preset: **Next.js** (Auto-detected).
5. Build Command: `npm run build` (Auto-detected).
6. Output Directory: `.next` (Auto-detected).
7. Click **"Deploy"**.

### Option B: Via Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 🔒 Security & Safe URL-Fetching Notes

SiteGrow treats all user-supplied URLs as untrusted input. The server-side crawler applies multi-layer defensive protections:
1. **Scheme Whitelist**: Only `http:` and `https:` schemes are accepted.
2. **DNS Pre-Lookup Check**: Resolves hostnames to IP addresses prior to connecting, blocking DNS rebinding to internal infrastructure.
3. **Private IP Blocking**: Automatically rejects loopback (`127.0.0.0/8`, `::1`), private networks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), link-local (`169.254.0.0/16`), and carrier-grade NAT.
4. **Manual Redirect Inspection**: Intercepts `301/302/307/308` headers to prevent redirect pivots into internal servers.
5. **Streaming Payload Caps**: Limits downloaded HTML to 2 MB to prevent memory exhaustion and decompression bomb attacks.
6. **Strict 8-Second Abort**: Prevents hanging connections and socket starvation.

---

## ⚠️ Current Scope & Limitations

- **Public Homepage Scope**: Default scans evaluate the primary public HTML landing page.
- **JavaScript SPA Limitations**: Heavily client-side rendered Single Page Applications (that render no initial HTML) will show limited DOM content unless pre-rendered.
- **Third-Party Lab Data**: Field Core Web Vitals (real-user CrUX data) require a connected Google PageSpeed API key.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
