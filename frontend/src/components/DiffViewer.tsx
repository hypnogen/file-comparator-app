import React from 'react';
import type { DifferenceItem, DiffStats, ViewMode } from '../types/diff';

interface DiffViewerProps {
  differences: DifferenceItem[];
  file1Name?: string;
  file2Name?: string;
  stats?: DiffStats | null;
  viewMode: ViewMode;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  differences,
  file1Name = 'Файл 1',
  file2Name = 'Файл 2',
  stats,
  viewMode,
}) => {
  if (differences.length === 0) {
    return (
      <div className="bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 p-4 rounded-lg border border-green-200 dark:border-green-800 text-center font-medium">
        Различий не обнаружено. Файлы идентичны.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Метаданные: Имена файлов и статистика */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-sm">
        <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-200">
          <span className="text-slate-500">Сравнение:</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{file1Name}</span>
          <span className="text-slate-400">↔</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{file2Name}</span>
        </div>

        {stats && (
          <div className="flex items-center gap-3 text-xs font-mono font-medium">
            <span className="px-2.5 py-1 rounded-md bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300">
              +{stats.additions} добавлено
            </span>
            <span className="px-2.5 py-1 rounded-md bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
              -{stats.deletions} удалено
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              ~{stats.modifications} изменено
            </span>
          </div>
        )}
      </div>

      {/* Таблица результатов */}
      <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
        {viewMode === 'split' ? (
          /* Split Mode */
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400 w-16 text-center">№</th>
                <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400 w-1/2 border-l border-slate-200 dark:border-slate-800 truncate">
                  {file1Name}
                </th>
                <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400 w-1/2 border-l border-slate-200 dark:border-slate-800 truncate">
                  {file2Name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
              {differences.map((diff, idx) => (
                <tr key={idx} className="text-slate-800 dark:text-slate-200">
                  <td className="py-2 px-3 text-center text-slate-400 dark:text-slate-500 select-none bg-slate-50 dark:bg-slate-800/40 text-xs">
                    {diff.line_number}
                  </td>
                  
                  <td className={`py-2 px-4 border-l border-slate-200 dark:border-slate-800 break-all ${
                    diff.type === 'Removed'
                      ? 'bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-300'
                      : diff.type === 'Modified'
                      ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300'
                      : ''
                  }`}>
                    {diff.file1 !== null ? (
                      <span className={diff.type === 'Removed' ? 'line-through opacity-80' : ''}>{diff.file1}</span>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700 select-none">—</span>
                    )}
                  </td>

                  <td className={`py-2 px-4 border-l border-slate-200 dark:border-slate-800 break-all ${
                    diff.type === 'Added'
                      ? 'bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-300'
                      : diff.type === 'Modified'
                      ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300'
                      : ''
                  }`}>
                    {diff.file2 !== null ? (
                      <span>{diff.file2}</span>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-700 select-none">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* Inline Mode */
          <table className="w-full text-left border-collapse text-sm font-mono">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-sans">
              <tr>
                <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400 w-16 text-center">№</th>
                <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">Содержимое</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {differences.map((diff, idx) => (
                <React.Fragment key={idx}>
                  {diff.type === 'Unchanged' && (
                    <tr>
                      <td className="py-1.5 px-3 text-center text-slate-400 dark:text-slate-500 select-none bg-slate-50 dark:bg-slate-800/40 text-xs border-r border-slate-200 dark:border-slate-800">
                        {diff.line_number}
                      </td>
                      <td className="py-1.5 px-4 break-all text-slate-800 dark:text-slate-200">
                        <span className="text-slate-400 select-none mr-3">&nbsp;</span>
                        {diff.file1}
                      </td>
                    </tr>
                  )}

                  {(diff.type === 'Removed' || diff.type === 'Modified') && diff.file1 !== null && (
                    <tr className="bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-300">
                      <td className="py-1.5 px-3 text-center text-red-400 dark:text-red-500 select-none bg-red-100/50 dark:bg-red-950/50 text-xs border-r border-slate-200 dark:border-slate-800">
                        {diff.line_number}
                      </td>
                      <td className="py-1.5 px-4 break-all">
                        <span className="text-red-500 font-bold select-none mr-3">-</span>
                        <span className="line-through opacity-80">{diff.file1}</span>
                      </td>
                    </tr>
                  )}

                  {(diff.type === 'Added' || diff.type === 'Modified') && diff.file2 !== null && (
                    <tr className="bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-300">
                      <td className="py-1.5 px-3 text-center text-green-500 select-none bg-green-100/50 dark:bg-green-950/50 text-xs border-r border-slate-200 dark:border-slate-800">
                        {diff.line_number}
                      </td>
                      <td className="py-1.5 px-4 break-all">
                        <span className="text-green-600 dark:text-green-400 font-bold select-none mr-3">+</span>
                        {diff.file2}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};