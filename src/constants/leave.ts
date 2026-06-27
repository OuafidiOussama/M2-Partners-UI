import type { LeaveType } from '../types';

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  VACATION: 'Vacation',
  SICK: 'Sick Leave',
};

export const VACATION_TOTAL_DAYS = 18;
export const SICK_TOTAL_DAYS = 3;
