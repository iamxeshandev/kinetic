import {
  Autocomplete,
  CircularProgress,
  TextField,
  type AutocompleteProps,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

export type FormAutocompleteProps<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
> = Omit<
  AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
  'renderInput' | 'value' | 'onChange'
> & {
  name: string;
  label: string;
};

export function FormAutocomplete<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
>({
  name,
  label,
  loading,
  ...props
}: FormAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          value={value ?? (props.multiple ? [] : null)}
          onChange={(_, data) => onChange(data)}
          {...props}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              slotProps={{
                ...params.slotProps,
                input: {
                  ...params.slotProps?.input,
                  endAdornment: (
                    <>
                      {loading && (
                        <CircularProgress color='inherit' size={20} />
                      )}
                      {params.slotProps?.input?.endAdornment}
                    </>
                  ),
                },
              }}
            />
          )}
        />
      )}
    />
  );
}
