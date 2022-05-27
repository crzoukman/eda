export default function (date: any) {
  return new Date(date)
    .toISOString()
    .slice(0, 10)
    .split('-')
    .reverse()
    .join('-');
}
