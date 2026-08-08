import React from 'react';
import type { DifferenceItem, ViewMode } from '../types/diff';

interface DiffViewerProps {
  differences: DifferenceItem[];
  viewMode: ViewMode;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ differences, viewMode }) => {
  if (differences.length === 0) {
    return (
      <div className="bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 p-4 rounded-lg border border-green-200 dark:border-green-800 text-center font-medium">
        Различий не обнаружено.
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
      {viewMode === 'split' ? (
        /* Режим Split (Две колонки) */
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400 w-16 text-center">№</th>
              <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400 w-1/2 border-l border-slate-200 dark:border-slate-800">Файл 1</th>
              <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400 w-1/2 border-l border-slate-200 dark:border-slate-800">Файл 2</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
            {differences.map((diff, idx) => (
              <tr key={idx} className="text-slate-800 dark:text-slate-200">
                <td className="py-2 px-3 text-center text-slate-400 dark:text-slate-500 select-none bg-slate-50 dark:bg-slate-800/40 text-xs">
                  {diff.line_number}
                </td>
                
                {/* Левая колонка (Файл 1) */}
                <td className={`py-2 px-4 border-l border-slate-200 dark:border-slate-800 break-all ${
                  diff.file1 !== null && diff.file2 === null
                    ? 'bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-300'
                    : diff.type === 'Modified'
                    ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300'
                    : ''
                }`}>
                  {diff.file1 !== null ? (
                    <span className={diff.file2 === null ? 'line-through opacity-80' : ''}>{diff.file1}</span>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-700 select-none">—</span>
                  )}
                </td>

                {/* Правая колонка (Файл 2) */}
                <td className={`py-2 px-4 border-l border-slate-200 dark:border-slate-800 break-all ${
                  diff.file2 !== null && diff.file1 === null
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
        /* Режим Inline (Единый поток) */
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
                {/* Неизмененная строка */}
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

                {/* Удаленная / измененная (старая) строка */}
                {(diff.file1 !== null && diff.type !== 'Unchanged') && (
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

                {/* Добавленная / измененная (новая) строка */}
                {(diff.file2 !== null && diff.type !== 'Unchanged') && (
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
  );
};