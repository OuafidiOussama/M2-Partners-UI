import { createApi } from '@reduxjs/toolkit/query/react';
import { authenticatedBaseQuery } from '../../app/baseApi';
import { ApiTags } from '../../app/apiTags';
import type { LeaveRequest, LeaveBalance, SubmitLeaveDto, RejectLeaveDto, LeavesFilter } from '../../types';

export const leavesApi = createApi({
  reducerPath: 'leavesApi',
  baseQuery: authenticatedBaseQuery,
  tagTypes: [ApiTags.Leave, ApiTags.LeaveBalance],
  endpoints: (builder) => ({
    submitLeave: builder.mutation<LeaveRequest, SubmitLeaveDto>({
      query: (body) => ({ url: '/leaves', method: 'POST', body }),
      invalidatesTags: [ApiTags.Leave, ApiTags.LeaveBalance],
    }),
    getMyLeaves: builder.query<LeaveRequest[], void>({
      query: () => '/leaves/my',
      providesTags: [ApiTags.Leave],
    }),
    getMyBalance: builder.query<LeaveBalance, void>({
      query: () => '/leaves/balance',
      providesTags: [ApiTags.LeaveBalance],
    }),
    getAllLeaves: builder.query<LeaveRequest[], LeavesFilter>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.status) params.set('status', filters.status);
        if (filters.type) params.set('type', filters.type);
        if (filters.employeeId) params.set('employeeId', filters.employeeId);
        return `/leaves?${params.toString()}`;
      },
      providesTags: [ApiTags.Leave],
    }),
    approveLeave: builder.mutation<LeaveRequest, string>({
      query: (id) => ({ url: `/leaves/${id}/approve`, method: 'PATCH' }),
      invalidatesTags: [ApiTags.Leave, ApiTags.LeaveBalance],
    }),
    rejectLeave: builder.mutation<
      LeaveRequest,
      { id: string } & RejectLeaveDto
    >({
      query: ({ id, reason }) => ({
        url: `/leaves/${id}/reject`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: [ApiTags.Leave],
    }),
    cancelLeave: builder.mutation<LeaveRequest, string>({
      query: (id) => ({ url: `/leaves/${id}/cancel`, method: 'PATCH' }),
      invalidatesTags: [ApiTags.Leave, ApiTags.LeaveBalance],
    }),
    forceApproveLeave: builder.mutation<LeaveRequest, string>({
      query: (id) => ({
        url: `/leaves/${id}/force-approve`,
        method: 'PATCH',
      }),
      invalidatesTags: [ApiTags.Leave, ApiTags.LeaveBalance],
    }),
  }),
});

export const {
  useSubmitLeaveMutation,
  useGetMyLeavesQuery,
  useGetMyBalanceQuery,
  useGetAllLeavesQuery,
  useApproveLeaveMutation,
  useRejectLeaveMutation,
  useForceApproveLeaveMutation,
  useCancelLeaveMutation,
} = leavesApi;
