export function varAlpha(colorChannel: string, alpha: number): string {
  return `rgba(${colorChannel} / ${alpha})`;
}
