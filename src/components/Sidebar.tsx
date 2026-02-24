'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { section: 'Overview' },
  { label: 'Dashboard', href: '/', icon: 'grid' },
  { label: 'Campaigns', href: '/campaigns', icon: 'activity', badge: '4' },
  { section: 'Platforms' },
  { label: 'Google Ads', href: '/google', icon: 'search' },
  { label: 'Meta Ads', href: '/meta', icon: 'facebook' },
  { section: 'Intelligence' },
  { label: 'AI Advisor', href: '/ai', icon: 'brain', badge: '5' },
  { label: 'Brand Health', href: '/brand', icon: 'heart' },
  { label: 'Markets', href: '/markets', icon: 'globe' },
  { section: 'Collections' },
  { label: 'All Collections', href: '/collections', icon: 'layers' },
];

const icons: Record<string, JSX.Element> = {
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  facebook: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  brain: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>,
  heart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  globe: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  layers: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]"><path d="m2 7 10-5 10 5-10 5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>,
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-[260px] bg-gradient-to-b from-plum-dark to-plum z-50 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="font-display text-white text-[22px] font-semibold tracking-wide">
          LoveLab
          <span className="block text-gold-light text-[13px] font-normal italic mt-0.5">
            La Lumière Command Center
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        {NAV_ITEMS.map((item, i) => {
          if ('section' in item && item.section) {
            return (
              <div key={i} className="px-5 pt-4 pb-2 text-[10px] uppercase tracking-[1.5px] text-white/40 font-semibold">
                {item.section}
              </div>
            );
          }

          if (!('href' in item) || !item.href) return null;

          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

          return (
            <Link
              key={i}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-2.5 mx-2 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {'icon' in item && item.icon && icons[item.icon]}
              {'label' in item && item.label}
              {'badge' in item && item.badge && (
                <span className="ml-auto bg-gold text-plum-dark text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 text-white/80 text-[13px]">
          <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-plum-dark font-bold text-[13px]">
            S
          </div>
          <div>
            <div className="font-medium text-[13px]">Sam Saleh</div>
            <div className="text-[11px] opacity-60">Founder, LoveLab</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
