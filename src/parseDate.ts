export function parseDate(date: Date, separator: string) {
  const dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const mm = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  return date.getFullYear() + separator + mm + separator + dd;
}