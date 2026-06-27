import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  MenuItem,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Skeleton,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {
  useGetAllLeavesQuery,
  useApproveLeaveMutation,
  useRejectLeaveMutation,
} from '../features/leaves/leavesApi';
import { StatusChip } from '../components/shared';
import { formatDate } from '../utils';
import { LEAVE_TYPE_LABELS } from '../constants';
import type { LeaveStatus, LeaveType } from '../types';

const STATUS_OPTIONS: Array<{ value: LeaveStatus | ''; label: string }> = [
  { value: '', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

const TYPE_OPTIONS: Array<{ value: LeaveType | ''; label: string }> = [
  { value: '', label: 'All Types' },
  { value: 'VACATION', label: 'Vacation' },
  { value: 'SICK', label: 'Sick Leave' },
];

export default function AdminLeavesPage(): React.ReactElement {
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | ''>('PENDING');
  const [typeFilter, setTypeFilter] = useState<LeaveType | ''>('');

  const { data: leaves, isLoading } = useGetAllLeavesQuery({
    status: statusFilter || undefined,
    type: typeFilter || undefined,
  });

  const [approveLeave, { isLoading: isApproving }] = useApproveLeaveMutation();
  const [rejectLeave, { isLoading: isRejecting }] = useRejectLeaveMutation();

  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; leaveId: string | null }>({
    open: false,
    leaveId: null,
  });
  const [rejectReason, setRejectReason] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  const handleApprove = async (id: string): Promise<void> => {
    setActionId(id);
    try {
      await approveLeave(id).unwrap();
    } finally {
      setActionId(null);
    }
  };

  const openRejectDialog = (id: string): void => {
    setRejectReason('');
    setRejectDialog({ open: true, leaveId: id });
  };

  const handleReject = async (): Promise<void> => {
    if (!rejectDialog.leaveId || !rejectReason.trim()) return;
    setActionId(rejectDialog.leaveId);
    try {
      await rejectLeave({ id: rejectDialog.leaveId, reason: rejectReason.trim() }).unwrap();
      setRejectDialog({ open: false, leaveId: null });
    } finally {
      setActionId(null);
    }
  };

  const isBusy = isApproving || isRejecting;

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        Manage Leave Requests
      </Typography>

      {/* Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as LeaveStatus | '')}
          size="small"
          sx={{ minWidth: 160 }}
        >
          {STATUS_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as LeaveType | '')}
          size="small"
          sx={{ minWidth: 160 }}
        >
          {TYPE_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {/* Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  {['Employee', 'Type', 'Start', 'End', 'Days', 'Reason', 'Status', 'Actions'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(8)].map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton variant="text" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !leaves || leaves.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">No leave requests found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  leaves.map((leave) => (
                    <TableRow key={leave.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {leave.employee?.full_name ?? '—'}
                      </TableCell>
                      <TableCell>{LEAVE_TYPE_LABELS[leave.type]}</TableCell>
                      <TableCell>{formatDate(leave.start_date)}</TableCell>
                      <TableCell>{formatDate(leave.end_date)}</TableCell>
                      <TableCell align="center">{leave.days}</TableCell>
                      <TableCell
                        sx={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        <Tooltip title={leave.reason ?? ''} placement="top">
                          <span>{leave.reason ?? '—'}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={leave.status} />
                      </TableCell>
                      <TableCell>
                        {leave.status === 'PENDING' && (
                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title="Approve">
                              <span>
                                <IconButton
                                  size="small"
                                  color="success"
                                  disabled={isBusy}
                                  onClick={() => handleApprove(leave.id)}
                                >
                                  {actionId === leave.id && isApproving ? (
                                    <CircularProgress size={18} color="inherit" />
                                  ) : (
                                    <CheckCircleOutlineIcon fontSize="small" />
                                  )}
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <span>
                                <IconButton
                                  size="small"
                                  color="error"
                                  disabled={isBusy}
                                  onClick={() => openRejectDialog(leave.id)}
                                >
                                  <CancelOutlinedIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Stack>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialog.open}
        onClose={() => setRejectDialog({ open: false, leaveId: null })}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle fontWeight={700}>Reject Leave Request</DialogTitle>
        <DialogContent>
          <TextField
            label="Reason for rejection"
            multiline
            rows={3}
            fullWidth
            autoFocus
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{ mt: 1 }}
            placeholder="Provide a reason that will be visible to the employee..."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setRejectDialog({ open: false, leaveId: null })}
            disabled={isRejecting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={!rejectReason.trim() || isRejecting}
            onClick={handleReject}
          >
            {isRejecting ? <CircularProgress size={20} color="inherit" /> : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
