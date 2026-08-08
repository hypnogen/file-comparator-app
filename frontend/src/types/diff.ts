export interface DifferenceItem {
  line_number: number;
  file1_line_number: number | null;
  file2_line_number: number | null;
  file1: string | null;
  file2: string | null;
  type: 'Unchanged' | 'Modified' | 'Added' | 'Removed';
}

export interface CompareResponse {
  status: 'success' | 'error';
  message?: string;
  differences: DifferenceItem[];
}

export type ViewMode = 'split' | 'inline';