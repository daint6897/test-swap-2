import { formatCurrency } from "./formatCurrency";

export function formatBigintToNumber(input: string | undefined,roundNumber = 9): string {
  if (!input) {
    return "";
  }
  try {
    const inputStr = input.toString().replace("n", "");
    const value = Number(inputStr) / Math.pow(10, roundNumber);

    const roundedValue = Math.round(value * 100) / 100;

    return formatCurrency(roundedValue.toString());
  } catch (error) {
    console.error("Error in formatBigIntToCurrency:", error);
    return "0.00";
  }
}
