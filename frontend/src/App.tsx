import { DropZone } from './components/DropZone';
import { DiffViewer } from './components/DiffViewer';
import { useFileCompare } from './hooks/useFileCompare';
import { RefreshCw } from 'lucide-react';
import './index.css';

export function App() {
  // Подключаем наш хук с реальной логикой
  const {
    file1,
    file2,
    setFile1,
    setFile2,
    differences,
    isLoading,
    error,
    compare,
    reset,
  } = useFileCompare();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    compare();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Заголовок */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Сравнение файлов
          </h1>
          <p className="mt-2 text-slate-600">
            Загрузите два текстовых документа (.txt, .docx и др.), чтобы увидеть разницу
          </p>
        </div>

        {/* Форма */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
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
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Сбросить
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Вывод ошибок */}
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 text-center font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Результаты сравнения */}
        {differences && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 px-1">
              Результаты сравнения
            </h2>
            <DiffViewer differences={differences} />
          </div>
        )}

      </div>
    </div>
  );
}

export default App;