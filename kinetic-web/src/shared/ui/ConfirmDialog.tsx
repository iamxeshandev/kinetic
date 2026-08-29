import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { Callback } from '../../utils/types/callback.types';

export type ConfirmDialogProps = {
  open: boolean;
  onClose: Callback;
  title: string;
  subtitle: string;
  action: ReactNode;
  strict?: boolean;
};

export function ConfirmDialog({
  open,
  onClose,
  title,
  subtitle,
  action,
  strict = false,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState<string>('');
  const isConfirmed = !strict || value === title;

  useEffect(() => {
    if (!strict || !open) return;

    const timeout = setTimeout(() => ref.current?.focus(), 0);

    return () => clearTimeout(timeout);
  }, [open, strict]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='xs'
      onTransitionExited={() => setValue('')}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography variant='body1'>{subtitle}</Typography>
          {strict && (
            <>
              <Typography variant='caption'>
                Enter <Typography component='span'>"{title}"</Typography> to
                confirm.
              </Typography>
              <TextField
                inputRef={ref}
                size='small'
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        {isConfirmed && action}
        <Button onClick={onClose} color='inherit'>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
