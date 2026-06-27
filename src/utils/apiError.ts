interface RtkError {
  status: number | string;
  data?: { message?: string };
}

export function getApiErrorMessage(error: unknown, fallback = 'An unexpected error occurred.'): string {
  if (!error) return fallback;
  const e = error as RtkError;
  if ('data' in e && e.data?.message) return e.data.message;
  if ('status' in e && e.status === 'FETCH_ERROR') return 'Network error. Please check your connection.';
  return fallback;
}
