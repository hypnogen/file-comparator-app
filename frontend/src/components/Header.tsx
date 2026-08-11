import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <div className="flex justify-between items-start">
      <div className="text-left">
        <h1 className="text-3xl font-bold tracking-tight">
          Сравнение файлов
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Загрузите два текстовых документа (.txt, .docx и др.), чтобы увидеть разницу
        </p>
      </div>

      <ThemeToggle />
    </div>
  );
}