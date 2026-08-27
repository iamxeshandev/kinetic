import { enqueueSnackbar, type OptionsObject } from 'notistack';

export const toast = {
  default: (message?: string, props?: OptionsObject<'default'>) =>
    message ? enqueueSnackbar(message, props) : undefined,

  success: (message?: string, props?: OptionsObject<'success'>) =>
    message
      ? enqueueSnackbar(message, { ...props, variant: 'success' })
      : undefined,

  error: (message?: string, props?: OptionsObject<'error'>) =>
    message
      ? enqueueSnackbar(message, { ...props, variant: 'error' })
      : undefined,

  warning: (message?: string, props?: OptionsObject<'warning'>) =>
    message
      ? enqueueSnackbar(message, { ...props, variant: 'warning' })
      : undefined,

  info: (message?: string, props?: OptionsObject<'info'>) =>
    message
      ? enqueueSnackbar(message, { ...props, variant: 'info' })
      : undefined,
};
