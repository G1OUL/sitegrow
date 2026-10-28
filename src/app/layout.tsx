import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'SiteGrow — Website Growth & Usability Audit SaaS for Small Business',
  description: 'Audit your website for usability friction, tap-to-call barriers, SEO metadata gaps, and speed bottlenecks with prioritized plain-English fixes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FBFBFA] text-charcoal-900 selection:bg-lime-brand selection:text-charcoal-900">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

