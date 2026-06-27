import dayjs from 'dayjs';

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  return dayjs(date).format('MMM D, YYYY');
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '—';
  return dayjs(date).format('MMM D, YYYY HH:mm');
}

export function formatDateISO(date: string | Date): string {
  return dayjs(date).format('YYYY-MM-DD');
}
