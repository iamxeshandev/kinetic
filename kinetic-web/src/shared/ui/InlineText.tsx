import {
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
  type BoxProps,
  type TextFieldProps,
  type TypographyProps,
} from '@mui/material';
import { useState } from 'react';
import { useBoolean } from '../hooks';

export type InlineTextProps = BoxProps & {
  value: string;
  onSave?: (value: string) => unknown;
  loading?: boolean;
  slotProps?: {
    textField?: TextFieldProps;
    typography?: TypographyProps;
  };
};

export function InlineText({
  value,
  onSave,
  loading,
  slotProps,
  ...props
}: InlineTextProps) {
  const editing = useBoolean();

  const [draft, setDraft] = useState<string>(value);

  const cancelEditing = () => {
    editing.setFalse();
    setDraft(value);
  };

  const save = async () => {
    if (loading) return;
    const nextValue = draft.trim();
    if (!nextValue || nextValue === value) {
      cancelEditing();
      return;
    }
    await onSave?.(nextValue);
    editing.setFalse();
  };

  const renderInput = (
    <TextField
      {...slotProps?.textField}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          save();
          return;
        }
        if (e.key === 'Escape') {
          cancelEditing();
          return;
        }
      }}
      autoFocus
      disabled={loading}
      slotProps={{
        input: {
          endAdornment: loading ? (
            <InputAdornment position='end'>
              <CircularProgress size={20} />
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );

  const renderText = (
    <Typography {...slotProps?.typography}>{value}</Typography>
  );

  return (
    <Box {...props} onClick={editing.setTrue}>
      {editing.value ? renderInput : renderText}
    </Box>
  );
}
