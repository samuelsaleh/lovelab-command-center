'use client';

interface InsightCalloutProps {
  title: string;
  text: string;
}

export default function InsightCallout({ title, text }: InsightCalloutProps) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 sm:p-5">
      <div className="mb-2 flex items-center gap-2">
        <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
        <h4 className="text-sm font-semibold text-blue-900">{title}</h4>
      </div>
      <p className="text-sm leading-relaxed text-blue-800">{text}</p>
    </div>
  );
}
