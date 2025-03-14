import { Link } from "react-router-dom";
import MoneyDisplay from "./MoneyDisplay";

interface TransactionProps {
  id: string;
  date: string;
  amount: number;
  description: string;
  account: string;
}

export default function Transaction({
  id,
  date,
  amount,
  description,
  account,
}: TransactionProps) {
  const formattedDate = new Date(date).toLocaleDateString("es-ES");

  return (
    <li>
      <Link
        to={`/edit/transaction/${id}`}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
      >
        <header>
          <p>{description}</p>
          <p className="text-gray-500">{formattedDate}</p>
        </header>
        <div>
          <p>
            <MoneyDisplay amount={amount} transactions />
          </p>
          <p className="text-gray-500 text-end">{account}</p>
        </div>
      </Link>
    </li>
  );
}
