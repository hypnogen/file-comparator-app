import React from 'react';
import type { DifferenceItem } from '../types/diff';

interface DiffViewerProps {
  differences: DifferenceItem[];
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ differences }) => {
  if (differences.length === 0) {
    return (
      <div className="bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 p-4 rounded-lg border border-green-200 dark:border-green-800 text-center font-medium">
        🎉 Различий не обнаружено! Файлы абсолютно идентичны.
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left border-collapse text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400 w-20 text-center">Строка</th>
            <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400 w-1/2 border-l border-slate-200 dark:border-slate-800">Файл 1</th>
            <th className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400 w-1/2 border-l border-slate-200 dark:border-slate-800">Файл 2</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {differences.map((diff, idx) => (
            <tr key={idx} className="font-mono text-slate-800 dark:text-slate-200">
              <td className="py-2 px-4 text-center text-slate-400 dark:text-slate-500 select-none bg-slate-50 dark:bg-slate-800/40">
                {diff.line_number}
              </td>
              <td className="py-2 px-4 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-300 border-l border-slate-200 dark:border-slate-800 break-all">
                <span className="line-through opacity-70">{diff.file1}</span>
              </td>
              <td className="py-2 px-4 bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-300 border-l border-slate-200 dark:border-slate-800 break-all">
                {diff.file2}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};