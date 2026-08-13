const FORMATS: Record<string, Intl.DateTimeFormatOptions> = {
  short: { month: 'short', day: 'numeric' },
  medium: { month: 'short', day: 'numeric', year: 'numeric' },
  long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
};

export function formatDate(
  date: Date | string,
  format: 'short' | 'medium' | 'long' = 'medium',
  locale?: Intl.LocalesArgument,
) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return typeof d === 'string'
    ? d
    : d.toLocaleDateString(locale, FORMATS[format ?? 'medium']);
}
