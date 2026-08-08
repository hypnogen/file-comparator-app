export interface DifferenceItem {
  line_number: number;
  file1: string | null;
  file2: string | null;
  type: 'Unchanged' | 'Modified' | 'Added' | 'Removed';
}

export interface DiffStats {
  additions: number;
  deletions: number;
  modifications: number;
}

export interface CompareResponse {
  status: 'success' | 'error';
  message?: string;
  file1_name?: string;
  file2_name?: string;
  stats?: DiffStats;
  differences?: DifferenceItem[];
}

export type ViewMode = 'split' | 'inline';