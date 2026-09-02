import {
  Checkbox,
  FormControlLabel,
  type CheckboxProps,
  type FormControlLabelProps,
} from '@mui/material';
import {
  Controller,
  useFormContext,
  type ControllerProps,
} from 'react-hook-form';

type FormCheckboxProps = Omit<FormControlLabelProps, keyof ControllerProps> & {
  name: ControllerProps['name'];
  label?: React.ReactNode;
  slotProps?: FormControlLabelProps['slotProps'] & {
    checkbox?: CheckboxProps;
  };
};

export function FormCheckbox({ name, slotProps, ...props }: FormCheckboxProps) {
  const { control } = useFormContext();
  const { checkbox: checkboxProps, ...formControlLabelSlotProps } =
    slotProps ?? {};

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          {...props}
          slotProps={formControlLabelSlotProps}
          control={
            <Checkbox
              {...checkboxProps}
              {...field}
              checked={field.value ?? false}
            />
          }
        />
      )}
    />
  );
}
