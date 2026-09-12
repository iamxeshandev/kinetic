import { TextField, type TextFieldProps } from '@mui/material';
import {
  Controller,
  useFormContext,
  type ControllerProps,
} from 'react-hook-form';

type FormTextFieldProps = Omit<TextFieldProps, 'value' | 'onChange'> & {
  name: ControllerProps['name'];
};

export function FormTextField({ name, ...props }: FormTextFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...props}
          {...field}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
}
