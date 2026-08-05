import React, { useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';

interface DropZoneProps {
  label: string;
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({
  label,
  selectedFile,
  onFileSelect,
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all cursor-pointer w-full h-48
        ${isDragOver 
          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30' 
          : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-100/50 dark:hover:bg-slate-800'
        }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <div className={`mb-4 p-3 rounded-full ${selectedFile ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
        {selectedFile ? <FileText size={28} /> : <UploadCloud size={28} />}
      </div>

      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
        {selectedFile ? (
          <span className="text-indigo-700 dark:text-indigo-400 font-semibold">{selectedFile.name}</span>
        ) : (
          <>
            {label} или <span className="text-indigo-600 dark:text-indigo-400 underline">выберите</span>
          </>
        )}
      </span>
      
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleInputChange}
      />
    </div>
  );
};