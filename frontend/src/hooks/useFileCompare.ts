import { useState } from 'react';
import type { CompareResponse, DifferenceItem, DiffStats } from '../types/diff';

export const useFileCompare = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [differences, setDifferences] = useState<DifferenceItem[] | null>(null);
  const [file1Name, setFile1Name] = useState<string>('');
  const [file2Name, setFile2Name] = useState<string>('');
  const [stats, setStats] = useState<DiffStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const compare = async () => {
    if (!file1 || !file2) {
      setError('Выберите оба файла для сравнения');
      return;
    }

    // Очистка старой ошибки и предыдущего результата перед новым запросом
    setIsLoading(true);
    setError(null);
    setDifferences(null);
    setStats(null);

    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        body: formData,
      });

      const data: CompareResponse = await response.json();

      if (response.ok && data.status === 'success') {
        setDifferences(data.differences || []);
        setFile1Name(data.file1_name || file1.name);
        setFile2Name(data.file2_name || file2.name);
        setStats(data.stats || null);
      } else {
        setError(data.message || 'Произошла ошибка при обработке файлов');
      }
    } catch (err) {
      setError('Не удалось связаться с сервером. Проверьте сетевое соединение.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFile1(null);
    setFile2(null);
    setDifferences(null);
    setFile1Name('');
    setFile2Name('');
    setStats(null);
    setError(null);
    setIsLoading(false);
  };

  return {
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
  };
};