'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useViewMode } from '@/context/ViewModeContext';

export default function SimpleModePage() {
  const router = useRouter();
  const { setMode } = useViewMode();

  useEffect(() => {
    setMode('simple');
    router.replace('/');
  }, [setMode, router]);

  return (
    <div className="flex min-h-[200px] items-center justify-center text-gray-500">
      Switching to Simple view...
    </div>
  );
}
