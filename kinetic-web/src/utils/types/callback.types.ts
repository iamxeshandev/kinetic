export type Callback<TArgs extends unknown[] = [], R = unknown> = (
  ...args: TArgs
) => R;
