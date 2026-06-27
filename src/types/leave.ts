import type { Employee } from './employee';

export type LeaveType = 'VACATION' | 'SICK';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveBalance {
  id: string;
  year: number;
  vacation_days: number;
  sick_days: number;
}

export interface LeaveRequest {
  id: string;
  employee: Pick<Employee, 'id' | 'full_name'>;
  type: LeaveType;
  start_date: string;
  end_date: string;
  days: number;
  status: LeaveStatus;
  reason: string | null;
  admin_reason: string | null;
  created_at: string;
}

export interface SubmitLeaveDto {
  type: LeaveType;
  start_date: string;
  end_date: string;
  reason?: string;
}

export interface RejectLeaveDto {
  reason: string;
}

export interface LeavesFilter {
  status?: LeaveStatus;
  type?: LeaveType;
  employeeId?: string;
}
