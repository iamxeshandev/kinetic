import {
  FormControl,
  InputLabel,
  Select,
  type SelectProps,
} from '@mui/material';
import {
  Controller,
  useFormContext,
  type ControllerProps,
} from 'react-hook-form';

type FormSelectProps = Omit<SelectProps, keyof ControllerProps> & {
  name: ControllerProps['name'];
};

export function FormSelect({
  name,
  label,
  children,
  ...props
}: FormSelectProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl fullWidth>
          <InputLabel id='label'>{label}</InputLabel>
          <Select {...props} {...field} labelId='label' label={label}>
            {children}
          </Select>
        </FormControl>
      )}
    />
  );
}
