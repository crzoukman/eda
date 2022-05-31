export default function formatDate(date: any) {
  return date.toISOString().slice(0, 10).split('-');
}
