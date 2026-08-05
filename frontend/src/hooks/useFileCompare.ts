import { useState } from 'react';
import { CompareResponse, DifferenceItem } from '../types/diff';

export const useFileCompare = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [differences, setDifferences] = useState<DifferenceItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const compare = async () => {
    if (!file1 || !file2) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        body: formData,
      });

      const data: CompareResponse = await response.json();

      if (data.status === 'success') {
        setDifferences(data.differences);
      } else {
        setError(data.message || 'Произошла ошибка при обработке');
      }
    } catch (err) {
      setError('Не удалось связаться с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFile1(null);
    setFile2(null);
    setDifferences(null);
    setError(null);
  };

  return {
    file1,
    file2,
    setFile1,
    setFile2,
    differences,
    isLoading,
    error,
    compare,
    reset,
  };
};