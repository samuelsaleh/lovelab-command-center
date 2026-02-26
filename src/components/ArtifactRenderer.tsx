'use client';

const OPEN_TAG = '```artifact';
const CLOSE_TAG = '```';

export type ArtifactPayload =
  | {
      type: 'recommendations';
      items: Array<{ priority?: string; title: string; analysis: string; action: string }>;
    }
  | {
      type: 'table';
      title?: string;
      headers: string[];
      rows: (string | number)[][];
    }
  | {
      type: 'metrics';
      items: Array<{ label: string; value: string; change?: string }>;
    };

type RecommendationsPayload = Extract<ArtifactPayload, { type: 'recommendations' }>;
type TablePayload = Extract<ArtifactPayload, { type: 'table' }>;
type MetricsPayload = Extract<ArtifactPayload, { type: 'metrics' }>;

export function parseArtifact(content: string): { artifact: ArtifactPayload | null; textWithoutArtifact: string } {
  const start = content.indexOf(OPEN_TAG);
  if (start === -1) return { artifact: null, textWithoutArtifact: content };
  const jsonStart = start + OPEN_TAG.length;
  const end = content.indexOf(CLOSE_TAG, jsonStart);
  if (end === -1) return { artifact: null, textWithoutArtifact: content };
  const raw = content.slice(jsonStart, end).trim();
  let artifact: ArtifactPayload | null = null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.type) artifact = parsed as ArtifactPayload;
  } catch {
    artifact = null;
  }
  const textWithoutArtifact = (content.slice(0, start) + content.slice(end + CLOSE_TAG.length)).trim();
  return { artifact, textWithoutArtifact };
}

const PRIORITY_STYLES: Record<string, string> = {
  Critical: 'border-l-red-500 bg-red-50/50',
  High: 'border-l-amber-500 bg-amber-50/50',
  Medium: 'border-l-plum bg-plum-bg/50',
};

function RecommendationsCard({ items }: { items: RecommendationsPayload }) {
  return (
    <div className="mt-3 space-y-2 rounded-xl border border-lovelab-border bg-white p-3 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-lovelab-muted">Recommendations</div>
      {items.items.map((item, i) => (
        <div
          key={i}
          className={`rounded-lg border-l-4 px-3 py-2.5 text-sm ${PRIORITY_STYLES[item.priority ?? 'Medium'] ?? PRIORITY_STYLES.Medium}`}
        >
          <div className="flex flex-wrap items-center gap-2">
            {item.priority && (
              <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase text-gray-600">
                {item.priority}
              </span>
            )}
            <span className="font-semibold text-gray-900">{item.title}</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">{item.analysis}</p>
          <p className="mt-1.5 text-xs font-medium text-plum-dark">&#8594; {item.action}</p>
        </div>
      ))}
    </div>
  );
}

function TableCard({ title, headers, rows }: TablePayload) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-lovelab-border bg-white shadow-sm">
      {title && (
        <div className="border-b border-gray-100 bg-gray-50/80 px-3 py-2 text-xs font-semibold text-gray-700">
          {title}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[200px] text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {headers.map((h, j) => (
                <th key={j} className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2 text-gray-800">
                    {typeof cell === 'number' ? cell.toLocaleString() : String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricsCard({ items }: { items: MetricsPayload }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {items.items.map((item, i) => (
        <div key={i} className="rounded-lg border border-lovelab-border bg-white p-3 shadow-sm">
          <div className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{item.label}</div>
          <div className="mt-0.5 text-lg font-bold text-plum-dark">{item.value}</div>
          {item.change && <div className="mt-0.5 text-xs text-gray-500">{item.change}</div>}
        </div>
      ))}
    </div>
  );
}

export default function ArtifactRenderer({ content }: { content: string }) {
  const { artifact } = parseArtifact(content);
  if (!artifact) return null;
  if (artifact.type === 'recommendations') return <RecommendationsCard items={artifact} />;
  if (artifact.type === 'table') return <TableCard {...artifact} />;
  if (artifact.type === 'metrics') return <MetricsCard items={artifact} />;
  return null;
}
