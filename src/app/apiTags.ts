export const ApiTags = {
  Leave: 'Leave',
  LeaveBalance: 'LeaveBalance',
  Employee: 'Employee',
} as const satisfies Record<string, string>;

export type ApiTag = (typeof ApiTags)[keyof typeof ApiTags];
