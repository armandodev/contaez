"use client";

import { formatMoney } from "./../../utils/formatters";

interface Props {
  className?: string;
  amount: number;
  transactions?: boolean;
}

export default function MoneyDisplay({
  className,
  amount,
  transactions = false,
}: Props) {
  const { integer, decimal, isNegative } = formatMoney(amount);

  return (
    <span
      className={`${
        isNegative ? "text-red-500" : transactions && "text-green-500"
      } ${className}`}
    >
      {isNegative ? "-" : transactions && "+"}${integer}
      <span className="align-top text-xs">{`.${decimal}`}</span>
    </span>
  );
}
