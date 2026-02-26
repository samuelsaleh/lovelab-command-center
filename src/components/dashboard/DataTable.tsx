'use client';

import type { ReactNode } from 'react';

export interface ColumnDef<T> {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  width?: string;
  render: (row: T, index: number) => ReactNode;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  highlightRow?: number;
  title?: string;
  headerRight?: ReactNode;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  highlightRow,
  title,
  headerRight,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {(title || headerRight) && (
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-5">
          {title && <h3 className="text-sm font-semibold text-gray-900">{title}</h3>}
          {headerRight}
        </div>
      )}
      <div className="overflow-x-auto">
        {data.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">{emptyMessage}</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    } ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-50 last:border-0 transition-colors ${
                    highlightRow === i ? 'bg-plum-bg/40' : 'hover:bg-gray-50/60'
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      } ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                    >
                      {col.render(row, i)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
