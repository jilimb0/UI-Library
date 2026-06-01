export function formatDate(date, locale = 'en-US') {
  return date.toLocaleDateString(locale);
}
