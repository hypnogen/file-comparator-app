import { useState } from 'react';

import { Header } from './components/Header';
import { CompareForm } from './components/CompareForm';
import { ComparisonResults } from './components/ComparisonResults';
import { useFileCompare } from './hooks/useFileCompare';
import type { ViewMode } from './types/diff';

export function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  const {
    file1,
    file2,
    setFile1,
    setFile2,
    differences,
    file1Name,
    file2Name,
    stats,
    isLoading,
    error,
    compare,
    reset,
  } = useFileCompare();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-8">
        <Header />

        <CompareForm
          file1={file1}
          file2={file2}
          differences={differences}
          isLoading={isLoading}
          setFile1={setFile1}
          setFile2={setFile2}
          compare={compare}
          reset={reset}
        />

        {error && (
          <div className="bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 p-4 rounded-xl border border-red-200 dark:border-red-800 text-center font-medium">
            ⚠️ {error}
          </div>
        )}

        {differences && (
          <ComparisonResults
            differences={differences}
            file1Name={file1Name}
            file2Name={file2Name}
            stats={stats}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        )}
      </div>
    </div>
  );
}

export default App;