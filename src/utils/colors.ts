export function getOpositeColor(color: string) {
  if (!color) return '#000000';
  const colorAsNumber = parseInt(color.replace('#', ''), 16);
  const opositeColorAsNumber = 0xffffff - colorAsNumber;
  return `#${opositeColorAsNumber.toString(16)}`;
}