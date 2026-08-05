export interface DifferenceItem {
  line_number: number;
  file1: string;
  file2: string;
}

export interface CompareResponse {
  status: 'success' | 'error';
  filename1: string;
  filename2: string;
  differences: DifferenceItem[];
  message?: string;
}

export type ViewMode = 'split' | 'inline';