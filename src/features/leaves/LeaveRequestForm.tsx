import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useSubmitLeaveMutation } from './leavesApi';
import type { SubmitLeaveDto, LeaveType } from '../../types';
import { AppSnackbar } from '../../components/shared';
import { formatDateISO } from '../../utils/date';
import { LEAVE_TYPE_LABELS } from '../../constants/leave';

interface FormValues {
  type: LeaveType;
  start_date: Dayjs | null;
  end_date: Dayjs | null;
  reason: string;
}

export default function LeaveRequestForm(): React.ReactElement {
  const [submitLeave, { isLoading }] = useSubmitLeaveMutation();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      type: 'VACATION',
      start_date: null,
      end_date: null,
      reason: '',
    },
  });

  const startDate = watch('start_date');

  const onSubmit = async (data: FormValues): Promise<void> => {
    if (!data.start_date || !data.end_date) return;

    const dto: SubmitLeaveDto = {
      type: data.type,
      start_date: formatDateISO(data.start_date.toDate()),
      end_date: formatDateISO(data.end_date.toDate()),
      reason: data.reason || undefined,
    };

    try {
      await submitLeave(dto).unwrap();
      setSnackbar({
        open: true,
        message: 'Leave request submitted successfully.',
        severity: 'success',
      });
      reset();
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to submit leave request. Please try again.',
        severity: 'error',
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Submit Leave Request
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  select
                  label="Leave Type"
                  fullWidth
                  error={!!errors.type}
                  helperText={errors.type?.message}
                  defaultValue="VACATION"
                  {...register('type', { required: 'Please select a leave type' })}
                >
                  {(Object.keys(LEAVE_TYPE_LABELS) as Array<keyof typeof LEAVE_TYPE_LABELS>).map((key) => (
                    <MenuItem key={key} value={key}>{LEAVE_TYPE_LABELS[key]}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="start_date"
                  control={control}
                  rules={{ required: 'Start date is required' }}
                  render={({ field }) => (
                    <DatePicker
                      label="Start Date"
                      value={field.value}
                      onChange={field.onChange}
                      disablePast
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.start_date,
                          helperText: errors.start_date?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="end_date"
                  control={control}
                  rules={{ required: 'End date is required' }}
                  render={({ field }) => (
                    <DatePicker
                      label="End Date"
                      value={field.value}
                      onChange={field.onChange}
                      disablePast
                      minDate={startDate ?? dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.end_date,
                          helperText: errors.end_date?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Reason (optional)"
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Briefly describe your reason for leave..."
                  {...register('reason')}
                />
              </Grid>

              <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  onClick={() => reset()}
                  disabled={isLoading}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  sx={{ minWidth: 140 }}
                >
                  {isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      />
    </LocalizationProvider>
  );
}
