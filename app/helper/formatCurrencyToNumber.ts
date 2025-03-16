export function formatCurrencyToNumber(value: string): number {
  if (!value) {
    return 0;
  }
  value = value.replace(/,/g, "");
  return Number(value);
}
