export const isValInputOnlyNumber = (value: string) => {
  if(value === ""){
    return true
  }
  return !/^\d*\.?\d*$/.test(value)
};
