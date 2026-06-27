import React from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, Skeleton } from '@mui/material';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import HealingIcon from '@mui/icons-material/Healing';

interface LeaveBalanceCardProps {
  type: 'vacation' | 'sick';
  remaining: number;
  total: number;
  isLoading?: boolean;
}

const CONFIG = {
  vacation: {
    label: 'Vacation Leave',
    icon: <BeachAccessIcon sx={{ fontSize: 32 }} />,
    color: 'secondary.main' as const,
    progressColor: 'secondary' as const,
  },
  sick: {
    label: 'Sick Leave',
    icon: <HealingIcon sx={{ fontSize: 32 }} />,
    color: 'primary.main' as const,
    progressColor: 'primary' as const,
  },
};

export default function LeaveBalanceCard({
  type,
  remaining,
  total,
  isLoading = false,
}: LeaveBalanceCardProps): React.ReactElement {
  const config = CONFIG[type];
  const percentage = total > 0 ? Math.max(0, (remaining / total) * 100) : 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 1, mt: 2 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {config.label}
            </Typography>
            <Typography variant="h4" fontWeight={700} color={config.color}>
              {remaining}{' '}
              <Typography component="span" variant="h6" color="text.secondary" fontWeight={400}>
                / {total} days
              </Typography>
            </Typography>
          </Box>
          <Box sx={{ color: config.color }}>{config.icon}</Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={percentage}
          color={config.progressColor}
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {Math.round(percentage)}% remaining
        </Typography>
      </CardContent>
    </Card>
  );
}
