import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import LeaveBalanceCard from '../features/leaves/LeaveBalanceCard';
import LeaveRequestForm from '../features/leaves/LeaveRequestForm';
import LeaveList from '../features/leaves/LeaveList';
import { useLeaveBalance } from '../hooks';

export default function LeavesPage(): React.ReactElement {
  const { vacationRemaining, sickRemaining, vacationTotal, sickTotal, isLoading } = useLeaveBalance();

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        My Leaves
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <LeaveBalanceCard
            type="vacation"
            remaining={vacationRemaining}
            total={vacationTotal}
            isLoading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <LeaveBalanceCard
            type="sick"
            remaining={sickRemaining}
            total={sickTotal}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <LeaveRequestForm />
      </Box>

      <LeaveList />
    </Box>
  );
}
