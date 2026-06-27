import { createApi } from '@reduxjs/toolkit/query/react';
import { authenticatedBaseQuery } from '../../app/baseApi';
import { ApiTags } from '../../app/apiTags';
import type { Employee } from '../../types';

export const employeesApi = createApi({
  reducerPath: 'employeesApi',
  baseQuery: authenticatedBaseQuery,
  tagTypes: [ApiTags.Employee],
  endpoints: (builder) => ({
    getMe: builder.query<Employee, void>({
      query: () => '/employees/me',
      providesTags: [ApiTags.Employee],
    }),
  }),
});

export const { useGetMeQuery } = employeesApi;
