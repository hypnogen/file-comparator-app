import { RefreshCw } from 'lucide-react';
import type { SubmitEvent } from 'react';

import { DropZone } from './DropZone';
import type { DifferenceItem } from '../types/diff';

interface CompareFormProps {
  file1: File | null;
  file2: File | null;
  differences: DifferenceItem[] | null;
  isLoading: boolean;
  setFile1: (file: File) => void;
  setFile2: (file: File) => void;
  compare: () => void;
  reset: () => void;
}

export function CompareForm({
  file1,
  file2,
  differences,
  isLoading,
  setFile1,
  setFile2,
  compare,
  reset,
}: CompareFormProps) {
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    compare();
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DropZone
            label="Первый файл (Оригинал)"
            selectedFile={file1}
            onFileSelect={setFile1}
          />

          <DropZone
            label="Второй файл (Измененный)"
            selectedFile={file2}
            onFileSelect={setFile2}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            disabled={!file1 || !file2 || isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                Сравниваем...
              </>
            ) : (
              'Сравнить файлы'
            )}
          </button>

          {(file1 || file2 || differences) && (
            <button
              type="button"
              onClick={reset}
              className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Сбросить
            </button>
          )}
        </div>
      </form>
    </div>
  );
}