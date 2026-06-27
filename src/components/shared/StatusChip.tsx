import React from 'react';
import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';

type StatusColorMap = Record<
  string,
  'warning' | 'success' | 'error' | 'info' | 'default'
>;

const STATUS_COLORS: StatusColorMap = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
  CANCELLED: 'default',
  GENERATED: 'info',
  DOWNLOADABLE: 'success',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  GENERATED: 'Generated',
  DOWNLOADABLE: 'Downloadable',
};

interface StatusChipProps extends Omit<ChipProps, 'color' | 'label'> {
  status: string;
}

export default function StatusChip({
  status,
  ...rest
}: StatusChipProps): React.ReactElement {
  return (
    <Chip
      label={STATUS_LABELS[status] ?? status}
      color={STATUS_COLORS[status] ?? 'default'}
      size="small"
      {...rest}
    />
  );
}
