export function parseDate(dateStr: string): Date {
  return new Date(Date.parse(dateStr));
}
