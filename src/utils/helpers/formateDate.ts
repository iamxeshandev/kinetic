import {
  formatDistanceToNow,
  isToday,
  isTomorrow,
  isYesterday,
} from 'date-fns';

type DateFormat = 'short' | 'medium' | 'long';

const FORMATS: Record<DateFormat, Intl.DateTimeFormatOptions> = {
  short: { month: 'short', day: 'numeric' },
  medium: { month: 'short', day: 'numeric', year: 'numeric' },
  long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
};

export function formatDate(
  date: Date | string,
  format?: DateFormat | 'relative',
  locale?: Intl.LocalesArgument,
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (typeof d === 'string') return d;

  if (format === 'relative') {
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    if (isYesterday(d)) return 'Yesterday';
    return formatDistanceToNow(d, { addSuffix: true });
  }

  return d.toLocaleDateString(locale, FORMATS[format ?? 'medium']);
}
