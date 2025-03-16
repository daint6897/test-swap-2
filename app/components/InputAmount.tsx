import { formatCurrency } from "../helper/formatCurrency";
import { isValInputOnlyNumber } from "../helper/isValInputOnlyNumber";

export const InputAmount = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const onChangeInput = (value: string) => {
    if (value === "") {
      onChange("");
      return;
    }
    value = value.replace(/,/g, "");
    if (isValInputOnlyNumber(value)) return;
    if (value.match(/^\d*\.$/)) {
      onChange(value);
      return;
    }
    const numValue = formatCurrency(value);
    onChange(numValue);
  };
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChangeInput(e.target.value)}
      placeholder="0.0"
      className="bg-transparent text-2xl outline-none w-[60%]"
    />
  );
};
