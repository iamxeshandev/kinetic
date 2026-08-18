export function checkOverdue(
  dueDate: Date | string,
  tolerance: number = 0,
): boolean {
  const d = new Date(dueDate);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > tolerance;
}
