import axios, { type AxiosInstance, type AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

/**
 * Normalizes any error thrown during HTTP requests into a standard ApiError shape.
 */
export const normalizeApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<{ message?: string }>;
    return {
      message: axiosErr.response?.data?.message || axiosErr.message || 'Network request failed',
      status: axiosErr.response?.status,
      data: axiosErr.response?.data,
    };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'An unexpected network error occurred' };
};

/**
 * Domain-agnostic HTTP client instance.
 * Configured with standard timeouts and error normalization interceptors.
 * Contains ZERO domain-specific URLs, headers, or caching assumptions.
 */
export const httpClient: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error))
);
