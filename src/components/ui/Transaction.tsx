import MoneyDisplay from "./MoneyDisplay";

interface TransactionProps {
  date: string;
  amount: number;
  description: string;
  account: string;
}

export default function Transaction({
  date,
  amount,
  description,
  account,
}: TransactionProps) {
  const formattedDate = new Date(date).toLocaleDateString("es-ES");

  return (
    <li className="flex items-center justify-between p-4 hover:bg-gray-100 transition-colors duration-200 ease-in-out">
      <header>
        <p>{description}</p>
        <p className="text-gray-500">{formattedDate}</p>
      </header>
      <div>
        <p>
          <MoneyDisplay amount={amount} />
        </p>
        <p>{account}</p>
      </div>
    </li>
  );
}
