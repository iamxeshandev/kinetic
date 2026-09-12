import { Box, type SxProps, type Theme } from '@mui/material';
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';

type FormProps<TFieldValues extends FieldValues = FieldValues> = {
  methods: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export function Form<TFieldValues extends FieldValues = FieldValues>({
  methods,
  onSubmit,
  children,
  sx,
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...methods}>
      <Box
        component='form'
        noValidate
        autoComplete='off'
        onSubmit={methods.handleSubmit(onSubmit)}
        sx={sx}
      >
        {children}
      </Box>
    </FormProvider>
  );
}
