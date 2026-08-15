export function checkOverdue(dueDate: Date | string): boolean {
  const d = new Date(dueDate);
  if (typeof d === 'string') return false;
  const now = new Date();
  return d < now;
}
