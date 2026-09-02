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
};

export function Form<TFieldValues extends FieldValues = FieldValues>({
  methods,
  onSubmit,
  children,
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...methods}>
      <form
        noValidate
        autoComplete='off'
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {children}
      </form>
    </FormProvider>
  );
}
