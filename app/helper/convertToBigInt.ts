export function convertToBigInt(value: string,roundNumber = 9): string {
  const numValue = value.replace(/,/g, "");
  const result = (Number(numValue) * Number(Math.pow(10, roundNumber)))
  if(!result ){
    return ""
  }
  return result.toString() + "n";
}
