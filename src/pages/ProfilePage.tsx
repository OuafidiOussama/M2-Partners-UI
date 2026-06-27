import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Grid,
  Skeleton,
} from '@mui/material';
import { useGetMeQuery } from '../features/employees/employeesApi';
import LeaveBalanceCard from '../features/leaves/LeaveBalanceCard';
import { useLeaveBalance } from '../hooks';
import { formatDate } from '../utils';

interface InfoRowProps {
  label: string;
  value: string | number | undefined | null;
  isLoading?: boolean;
}

function InfoRow({ label, value, isLoading }: InfoRowProps): React.ReactElement {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        display="block"
        textTransform="uppercase"
        letterSpacing={0.5}
        sx={{ mb: 0.25 }}
      >
        {label}
      </Typography>
      {isLoading ? (
        <Skeleton variant="text" width="50%" />
      ) : (
        <Typography variant="body1">{value ?? '—'}</Typography>
      )}
    </Box>
  );
}

export default function ProfilePage(): React.ReactElement {
  const { data: employee, isLoading: empLoading } = useGetMeQuery();
  const { vacationRemaining, sickRemaining, vacationTotal, sickTotal, isLoading: balanceLoading } = useLeaveBalance();

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2.5 }} />
              <InfoRow label="Full Name" value={employee?.full_name} isLoading={empLoading} />
              <InfoRow label="Email" value={employee?.email} isLoading={empLoading} />
              <InfoRow label="CIN" value={employee?.cin} isLoading={empLoading} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Contract Information
              </Typography>
              <Divider sx={{ mb: 2.5 }} />
              <InfoRow
                label="Start Date"
                value={empLoading ? undefined : formatDate(employee?.start_date)}
                isLoading={empLoading}
              />
              <InfoRow
                label="Net Salary"
                value={
                  empLoading
                    ? undefined
                    : employee?.net_salary
                    ? `${Number(employee.net_salary).toLocaleString()} MAD`
                    : '—'
                }
                isLoading={empLoading}
              />
              <InfoRow
                label="Gross Salary"
                value={
                  empLoading
                    ? undefined
                    : employee?.gross_salary
                    ? `${Number(employee.gross_salary).toLocaleString()} MAD`
                    : '—'
                }
                isLoading={empLoading}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Leave Balance
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <LeaveBalanceCard
                type="vacation"
                remaining={vacationRemaining}
                total={vacationTotal}
                isLoading={balanceLoading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <LeaveBalanceCard
                type="sick"
                remaining={sickRemaining}
                total={sickTotal}
                isLoading={balanceLoading}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
