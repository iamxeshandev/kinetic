import { enqueueSnackbar, type OptionsObject } from 'notistack';

export const toast = {
  default: (message: string, props?: OptionsObject<'default'>) =>
    enqueueSnackbar(message, props),

  success: (message: string, props?: OptionsObject<'success'>) =>
    enqueueSnackbar(message, { ...props, variant: 'success' }),

  error: (message: string, props?: OptionsObject<'error'>) =>
    enqueueSnackbar(message, { ...props, variant: 'error' }),

  warning: (message: string, props?: OptionsObject<'warning'>) =>
    enqueueSnackbar(message, { ...props, variant: 'warning' }),

  info: (message: string, props?: OptionsObject<'info'>) =>
    enqueueSnackbar(message, { ...props, variant: 'info' }),
};
