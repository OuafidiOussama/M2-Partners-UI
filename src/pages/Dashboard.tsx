import React from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Skeleton,
} from '@mui/material';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import HealingIcon from '@mui/icons-material/Healing';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { useGetMyLeavesQuery } from '../features/leaves/leavesApi';
import { useLeaveBalance } from '../hooks';
import { StatusChip } from '../components/shared';
import { formatDate } from '../utils';
import { LEAVE_TYPE_LABELS } from '../constants';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactElement;
  color: string;
  isLoading?: boolean;
}

function StatCard({ label, value, icon, color, isLoading }: StatCardProps): React.ReactElement {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {label}
            </Typography>
            {isLoading ? (
              <Skeleton variant="text" width={60} height={40} />
            ) : (
              <Typography variant="h4" fontWeight={700} color={color}>
                {value}
              </Typography>
            )}
          </Box>
          <Box sx={{ color, opacity: 0.8 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard(): React.ReactElement {
  const { vacationRemaining, sickRemaining, isLoading: balanceLoading } = useLeaveBalance();
  const { data: leaves, isLoading: leavesLoading } = useGetMyLeavesQuery();

  const pendingCount = leaves?.filter((l) => l.status === 'PENDING').length ?? 0;
  const recentLeaves = leaves?.slice(0, 5) ?? [];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        My Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="Vacation Days Remaining"
            value={vacationRemaining}
            icon={<BeachAccessIcon sx={{ fontSize: 40 }} />}
            color="secondary.main"
            isLoading={balanceLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="Sick Days Remaining"
            value={sickRemaining}
            icon={<HealingIcon sx={{ fontSize: 40 }} />}
            color="primary.main"
            isLoading={balanceLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="Pending Requests"
            value={pendingCount}
            icon={<PendingActionsIcon sx={{ fontSize: 40 }} />}
            color="warning.main"
            isLoading={leavesLoading}
          />
        </Grid>
      </Grid>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Recent Activity
          </Typography>
          {leavesLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={40} />
              ))}
            </Box>
          ) : recentLeaves.length === 0 ? (
            <Typography color="text.secondary">No recent activity.</Typography>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                    {['Type', 'Start', 'End', 'Days', 'Status'].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: 'left',
                          padding: '8px 16px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#666',
                          textTransform: 'uppercase',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentLeaves.map((leave) => (
                    <tr key={leave.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '10px 16px' }}>{LEAVE_TYPE_LABELS[leave.type]}</td>
                      <td style={{ padding: '10px 16px' }}>{formatDate(leave.start_date)}</td>
                      <td style={{ padding: '10px 16px' }}>{formatDate(leave.end_date)}</td>
                      <td style={{ padding: '10px 16px' }}>{leave.days}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <StatusChip status={leave.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
