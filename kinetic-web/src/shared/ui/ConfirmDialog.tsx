import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  type DialogProps,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';

export type ConfirmDialogProps = Omit<DialogProps, 'content'> & {
  title: string;
  content: React.ReactNode;
  action: React.ReactNode;
  strict?: boolean;
};

export function ConfirmDialog({
  open,
  onClose,
  title,
  content,
  action,
  strict = false,
  ...props
}: ConfirmDialogProps) {
  const ref = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState<string>('');

  const isConfirmed = !strict || value === title;

  useEffect(() => {
    if (!strict || !open) return;

    const reset = () => setValue('');

    reset();

    const timeout = setTimeout(() => ref.current?.focus(), 0);

    return () => clearTimeout(timeout);
  }, [open, strict]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs' {...props}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Box>{content}</Box>
          {strict && (
            <Box>
              <Typography variant='caption'>
                Enter "{title}" to confirm.
              </Typography>
              <TextField
                inputRef={ref}
                fullWidth
                size='small'
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={(e) => onClose?.(e, 'backdropClick')} color='inherit'>
          Cancel
        </Button>
        {isConfirmed && action}
      </DialogActions>
    </Dialog>
  );
}
