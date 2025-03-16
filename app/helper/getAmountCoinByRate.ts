import { formatCurrency } from "./formatCurrency";
import { multiplyLargeNumbers } from "./multiplyLargeNumbers";

export function getAmountCoinByRate(value: string, rate?: number): string {
  if (!value || !rate) {
    return "";
  }
  return multiplyLargeNumbers(value, rate.toFixed(3));
}
