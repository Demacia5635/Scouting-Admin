export function getOpositeColor(color: string) {
  const colorAsNumber = parseInt(color.replace('#', ''), 16);
  const opositeColorAsNumber = 0xffffff - colorAsNumber;
  return `#${opositeColorAsNumber.toString(16)}`;
}