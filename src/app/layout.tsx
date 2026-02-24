import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { MobileMenuProvider } from '@/context/MobileMenuContext';
import { ViewModeProvider } from '@/context/ViewModeContext';
import { DataRefreshProvider } from '@/context/DataRefreshContext';

export const metadata: Metadata = {
  title: 'LoveLab — La Lumière Command Center',
  description: 'Marketing intelligence dashboard for LoveLab Antwerp. Live Google Ads + Meta Ads data with AI-powered recommendations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MobileMenuProvider>
          <ViewModeProvider>
            <DataRefreshProvider>
              <Sidebar />
              <main className="min-h-screen md:ml-16 lg:ml-[260px]">
                <Topbar />
                <div className="p-4 pb-16 sm:p-5 lg:p-6">
                  {children}
                </div>
              </main>
            </DataRefreshProvider>
          </ViewModeProvider>
        </MobileMenuProvider>
      </body>
    </html>
  );
}
