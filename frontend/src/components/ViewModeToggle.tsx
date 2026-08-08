import React from 'react';
import { Columns2, Rows2 } from 'lucide-react';
import type { ViewMode } from '../types/diff';

interface ViewModeToggleProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  mode,
  onModeChange,
}) => {
  return (
    <div className="inline-flex p-1 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
      <button
        type="button"
        onClick={() => onModeChange('split')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          mode === 'split'
            ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        <Columns2 size={16} />
        <span>Две колонки</span>
      </button>

      <button
        type="button"
        onClick={() => onModeChange('inline')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          mode === 'inline'
            ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
      >
        <Rows2 size={16} />
        <span>В одну строку</span>
      </button>
    </div>
  );
};