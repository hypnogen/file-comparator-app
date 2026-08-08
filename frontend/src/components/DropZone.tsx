import React, { useState } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';

interface DropZoneProps {
  label: string;
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
}

// Список допустимых расширений (соответствует бэкенду)
const ALLOWED_EXTENSIONS = [
  '.txt', '.docx', '.md', '.markdown',
  '.json', '.csv', '.xml', '.yaml', '.yml',
  '.py', '.js', '.ts', '.jsx', '.tsx', '.html', '.css'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 МБ

// Функция форматирования размера файла
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const DropZone: React.FC<DropZoneProps> = ({
  label,
  selectedFile,
  onFileSelect,
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateAndSelect = (file: File) => {
    setValidationError(null);

    // 1. Проверка расширения
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      setValidationError(`Формат ${fileExt} не поддерживается`);
      return;
    }

    // 2. Проверка размера
    if (file.size > MAX_FILE_SIZE) {
      setValidationError(`Файл слишком большой (> 10 МБ)`);
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all cursor-pointer w-full h-48
          ${validationError 
            ? 'border-red-400 bg-red-50/50 dark:bg-red-950/20' 
            : isDragOver 
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30' 
              : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-100/50 dark:hover:bg-slate-800'
          }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div className={`mb-3 p-3 rounded-full ${
          validationError
            ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
            : selectedFile 
              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
        }`}>
          {validationError ? <AlertCircle size={28} /> : selectedFile ? <FileText size={28} /> : <UploadCloud size={28} />}
        </div>

        <div className="flex flex-col items-center text-center max-w-[90%]">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate w-full">
            {selectedFile ? (
              <span className="text-indigo-700 dark:text-indigo-400 font-semibold">{selectedFile.name}</span>
            ) : (
              <>
                {label} или <span className="text-indigo-600 dark:text-indigo-400 underline">выберите</span>
              </>
            )}
          </span>

          {/* Индикатор размера выбранного файла */}
          {selectedFile && (
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              {formatFileSize(selectedFile.size)}
            </span>
          )}

          {/* Сообщение об ошибке валидации */}
          {validationError && (
            <span className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">
              {validationError}
            </span>
          )}
        </div>
        
        {/* Инпут с атрибутом accept для системной фильтрации */}
        <input
          type="file"
          accept={ALLOWED_EXTENSIONS.join(',')}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};