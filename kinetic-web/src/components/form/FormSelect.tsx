import { Select, type SelectProps } from '@mui/material';
import {
  Controller,
  useFormContext,
  type ControllerProps,
} from 'react-hook-form';

type FormSelectProps = Omit<SelectProps, keyof ControllerProps> & {
  name: ControllerProps['name'];
};

export function FormSelect({ name, children, ...props }: FormSelectProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select {...props} {...field}>
          {children}
        </Select>
      )}
    />
  );
}
