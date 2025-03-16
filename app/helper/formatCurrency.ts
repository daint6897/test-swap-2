export function formatCurrency(value: string): string {
  if (!value) {
    return "";
  }
  value = value.replace(/,/g, "");
  const parts = value.split(".");
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? "." + parts[1] : "";

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return formattedInteger + decimalPart;
}
