'use client';

interface AlertBoxProps {
  title: string;
  text: string;
  type?: 'warning' | 'error' | 'info';
}

const STYLES = {
  warning: { container: 'border-amber-200 bg-amber-50/50', icon: 'text-amber-500', title: 'text-amber-900', text: 'text-amber-800' },
  error: { container: 'border-red-200 bg-red-50/50', icon: 'text-red-500', title: 'text-red-900', text: 'text-red-800' },
  info: { container: 'border-blue-200 bg-blue-50/50', icon: 'text-blue-500', title: 'text-blue-900', text: 'text-blue-800' },
};

export default function AlertBox({ title, text, type = 'warning' }: AlertBoxProps) {
  const s = STYLES[type];

  return (
    <div className={`rounded-xl border p-4 sm:p-5 ${s.container}`}>
      <div className="mb-2 flex items-center gap-2">
        <svg className={`h-5 w-5 ${s.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <h4 className={`text-sm font-semibold ${s.title}`}>{title}</h4>
      </div>
      <p className={`text-sm leading-relaxed ${s.text}`}>{text}</p>
    </div>
  );
}
