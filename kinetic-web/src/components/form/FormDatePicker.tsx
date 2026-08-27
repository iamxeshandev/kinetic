import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  DatePicker,
  type DatePickerProps,
} from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Controller,
  useFormContext,
  type ControllerProps,
} from 'react-hook-form';

export type FormDatePickerProps = Omit<
  DatePickerProps,
  'name' | 'value' | 'onChange'
> & {
  name: ControllerProps['name'];
};

export function FormDatePicker({ name, ...props }: FormDatePickerProps) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            {...props}
            value={field.value}
            onChange={field.onChange}
            inputRef={field.ref}
            slotProps={{
              ...props.slotProps,
              textField: {
                ...props.slotProps?.textField,
                error: !!fieldState.error,
                helperText: fieldState.error?.message,
              },
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
}
