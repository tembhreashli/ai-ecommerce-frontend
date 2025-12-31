import { useState, useEffect } from 'react';
import { getErrorMessage } from '../utils/helpers';

interface UseFetchOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export const useFetch = <T,>(
  fetchFunction: () => Promise<T>,
  options: UseFetchOptions<T> = {}
) => {
  const { initialData, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction();
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    execute();
  }, []);

  const refetch = () => {
    return execute();
  };

  return {
    data,
    loading,
    error,
    refetch,
    execute,
  };
};

/**
 * Lazy fetch hook - doesn't execute automatically
 */
export const useLazyFetch = <T,>(
  fetchFunction: () => Promise<T>,
  options: UseFetchOptions<T> = {}
) => {
  const { initialData, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction();
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    execute,
  };
};
