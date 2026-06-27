import { useGetMyBalanceQuery } from '../features/leaves/leavesApi';
import { VACATION_TOTAL_DAYS, SICK_TOTAL_DAYS } from '../constants';

export function useLeaveBalance() {
  const { data: balance, isLoading, isError } = useGetMyBalanceQuery();

  return {
    vacationRemaining: balance?.vacation_days ?? 0,
    sickRemaining: balance?.sick_days ?? 0,
    vacationTotal: VACATION_TOTAL_DAYS,
    sickTotal: SICK_TOTAL_DAYS,
    isLoading,
    isError,
  };
}
