'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMobileMenu } from '@/context/MobileMenuContext';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: 'grid' },
  { label: 'Marketing Performance', href: '/performance', icon: 'activity' },
  { label: 'AI Advisor', href: '/ai', icon: 'brain' },
];

const icons: Record<string, JSX.Element> = {
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px] shrink-0"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px] shrink-0"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px] shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  facebook: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px] shrink-0"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  brain: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px] shrink-0"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>,
  heart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px] shrink-0"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  globe: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px] shrink-0"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  sparkles: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px] shrink-0"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  layers: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px] shrink-0"><path d="m2 7 10-5 10 5-10 5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>,
};

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useMobileMenu();

  const handleNavClick = () => {
    close();
  };

  return (
    <>
      {/* Backdrop: mobile only, when sidebar open */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={close}
      />

      {/* Sidebar: mobile overlay | md: collapsed icons | lg: full */}
      <nav
        className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col bg-gradient-to-b from-plum-dark to-plum transition-transform duration-200 ease-out
          w-[260px] max-md:translate-x-[-100%] max-md:shadow-xl
          md:w-16 md:translate-x-0
          lg:w-[260px] lg:translate-x-0
          ${isOpen ? 'max-md:translate-x-0' : ''}
        `}
      >
        {/* Logo: full on lg/mobile, icon-only on md */}
        <div className="flex h-14 min-h-[56px] items-center border-b border-white/10 px-5 md:justify-center md:px-0">
          <Link href="/" onClick={handleNavClick} className="flex items-center gap-3 md:flex-col md:gap-0">
            <span className="font-display text-white text-[22px] font-semibold tracking-wide md:text-xl">LoveLab</span>
            <span className="hidden text-gold-light text-[13px] font-normal italic md:block md:text-[10px]">LL</span>
            <span className="block text-gold-light text-[13px] font-normal italic mt-0.5 md:hidden">
              La Lumière Command Center
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map((item, i) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link
                key={i}
                href={item.href}
                onClick={handleNavClick}
                className={`font-label flex min-h-[44px] items-center gap-3 px-5 py-2.5 mx-2 rounded-lg text-sm transition-all md:justify-center md:px-0 md:mx-1 ${
                  isActive
                    ? 'bg-white/15 text-white font-medium'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                title={item.label}
              >
                {icons[item.icon]}
                <span className="md:sr-only">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer: compact on md */}
        <div className="flex items-center gap-3 border-t border-white/10 px-5 py-4 text-white/80 text-[13px] md:justify-center md:px-0">
          <div className="w-8 h-8 shrink-0 rounded-full bg-gold flex items-center justify-center text-plum-dark font-bold text-[13px]">
            S
          </div>
          <div className="md:hidden">
            <div className="font-medium text-[13px]">Sam Saleh</div>
            <div className="text-[11px] opacity-60">Founder, LoveLab</div>
          </div>
        </div>
      </nav>
    </>
  );
}
