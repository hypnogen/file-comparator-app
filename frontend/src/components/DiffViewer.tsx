import React from 'react';
import type { DifferenceItem } from '../types/diff';

interface DiffViewerProps {
  differences: DifferenceItem[];
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ differences }) => {
  if (differences.length === 0) {
    return (
      <div className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 text-center font-medium">
        🎉 Различий не обнаружено! Файлы абсолютно идентичны.
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-slate-200 rounded-xl bg-white shadow-sm">
      <table className="w-full text-left border-collapse text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="py-3 px-4 font-semibold text-slate-600 w-20 text-center">Строка</th>
            <th className="py-3 px-4 font-semibold text-slate-600 w-1/2 border-l border-slate-200">Файл 1</th>
            <th className="py-3 px-4 font-semibold text-slate-600 w-1/2 border-l border-slate-200">Файл 2</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {differences.map((diff, idx) => (
            <tr key={idx} className="font-mono text-slate-800">
              <td className="py-2 px-4 text-center text-slate-400 select-none bg-slate-50">
                {diff.line_number}
              </td>
              <td className="py-2 px-4 bg-red-50 text-red-900 border-l border-slate-200 break-all relative">
                {/* Легкая красная заливка для удаленного */}
                <span className="line-through opacity-70">{diff.file1}</span>
              </td>
              <td className="py-2 px-4 bg-green-50 text-green-900 border-l border-slate-200 break-all">
                {/* Легкая зеленая заливка для добавленного */}
                {diff.file2}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};