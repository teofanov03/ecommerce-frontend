import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axios';
import { AxiosError } from 'axios';

interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
  refetch: () => Promise<void>;
}

function useFetch<T>(url: string, initialData: T | null = null): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<T>(url); // <T> tipizuje response.data
      setData(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError);
      console.error("Fetch error:", axiosError);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export default useFetch;
