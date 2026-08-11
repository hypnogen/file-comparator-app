import { DiffViewer } from './DiffViewer';
import { ViewModeToggle } from './ViewModeToggle';
import type { DifferenceItem, DiffStats, ViewMode } from '../types/diff';

interface ComparisonResultsProps {
  differences: DifferenceItem[];
  file1Name: string;
  file2Name: string;
  stats: DiffStats | null;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ComparisonResults({
  differences,
  file1Name,
  file2Name,
  stats,
  viewMode,
  onViewModeChange,
}: ComparisonResultsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <h2 className="text-xl font-semibold">
          Результаты сравнения
        </h2>

        <ViewModeToggle
          mode={viewMode}
          onModeChange={onViewModeChange}
        />
      </div>

      <DiffViewer
        differences={differences}
        file1Name={file1Name}
        file2Name={file2Name}
        stats={stats}
        viewMode={viewMode}
      />
    </div>
  );
}