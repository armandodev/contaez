export function formatMoney(amount: number) {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(amount)) {
    return { integer: "0", decimal: "00", isNegative: false };
  }

  const absAmount = Math.abs(numAmount);
  const formattedAmount = absAmount.toFixed(2);
  const [integer, decimal] = formattedAmount.toString().split(".");

  return {
    integer: addThousandsSeparator(integer),
    decimal,
    isNegative: amount < 0,
  };
}

function addThousandsSeparator(num: string) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
