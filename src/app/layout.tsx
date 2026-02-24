import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export const metadata: Metadata = {
  title: 'LoveLab — La Lumière Command Center',
  description: 'Marketing intelligence dashboard for LoveLab Antwerp. Live Google Ads + Meta Ads data with AI-powered recommendations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <main className="ml-[260px] min-h-screen">
          <Topbar />
          <div className="p-6 pb-16">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
