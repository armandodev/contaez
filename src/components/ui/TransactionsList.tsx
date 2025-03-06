import data from "../../data.json";
import Transaction from "./Transaction";

export default function TransactionsList() {
  return (
    <ul className="grid bg-white w-full max-w-screen-sm mx-auto rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center my-4">Transacciones</h2>
      {data.map((transaction) => (
        <Transaction
          key={transaction.id}
          date={transaction.date}
          amount={transaction.amount}
          description={transaction.description}
          account={transaction.account}
        />
      ))}
    </ul>
  );
}
