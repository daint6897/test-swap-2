const PERCENT_AMOUNT = [
  {
    label: "Half",
    value: 0.5,
  },
  {
    label: "Max",
    value: 1,
  },
];
export default function SelectPercentAmount({
  onChangePercentAmount,
}: {
  onChangePercentAmount: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {PERCENT_AMOUNT.map((item) => (
        <div
          className="font-bold cursor-pointer"
          key={item.value}
          onClick={() => onChangePercentAmount(item.value)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}
