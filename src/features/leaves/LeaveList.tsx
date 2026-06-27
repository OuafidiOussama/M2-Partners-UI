import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  CircularProgress,
  TableContainer,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { useGetMyLeavesQuery, useCancelLeaveMutation } from './leavesApi';
import { StatusChip } from '../../components/shared';
import { formatDate } from '../../utils/date';
import { LEAVE_TYPE_LABELS } from '../../constants/leave';

export default function LeaveList(): React.ReactElement {
  const { data: leaves, isLoading, isError } = useGetMyLeavesQuery();
  const [cancelLeave, { isLoading: isCancelling }] = useCancelLeaveMutation();

  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleConfirmCancel = async (): Promise<void> => {
    if (!confirmId) return;
    try {
      await cancelLeave(confirmId).unwrap();
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Leave History
          </Typography>

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {isError && (
            <Typography color="error" sx={{ py: 2 }}>
              Failed to load leave history.
            </Typography>
          )}

          {!isLoading && !isError && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Start</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>End</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Days</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Note</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaves && leaves.length > 0 ? (
                    leaves.map((leave) => (
                      <TableRow key={leave.id} hover>
                        <TableCell>{LEAVE_TYPE_LABELS[leave.type] ?? leave.type}</TableCell>
                        <TableCell>{formatDate(leave.start_date)}</TableCell>
                        <TableCell>{formatDate(leave.end_date)}</TableCell>
                        <TableCell align="center">{leave.days}</TableCell>
                        <TableCell>
                          <StatusChip status={leave.status} />
                        </TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {leave.status === 'REJECTED' && leave.admin_reason
                            ? leave.admin_reason
                            : (leave.reason ?? '—')}
                        </TableCell>
                        <TableCell align="center">
                          {leave.status === 'PENDING' && (
                            <Tooltip title="Cancel request">
                              <span>
                                <IconButton
                                  size="small"
                                  color="error"
                                  disabled={isCancelling}
                                  onClick={() => setConfirmId(leave.id)}
                                >
                                  <DoDisturbIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No leave requests yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Cancel confirmation dialog */}
      <Dialog
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle fontWeight={700}>Cancel Leave Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this leave request? This action cannot be undone, but you can submit a new request for different dates.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmId(null)} disabled={isCancelling}>
            Keep it
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmCancel}
            disabled={isCancelling}
          >
            {isCancelling ? <CircularProgress size={20} color="inherit" /> : 'Yes, cancel it'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
