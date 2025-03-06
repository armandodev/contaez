import Transaction from "./Transaction";
import { useTransactions } from "../../hooks/useTransactions";
import { Link } from "react-router-dom";

export default function TransactionsList() {
  const { transactions, loading, error } = useTransactions();

  return (
    <ul className="grid bg-white w-full mx-auto rounded-lg shadow-md">
      <header className="flex justify-between items-center p-4">
        <h2 className="text-xl font-bold">Transacciones</h2>
        <Link
          to="/create/transaction"
          className="text-blue-500 hover:underline"
        >
          Agregar
        </Link>
      </header>

      {error && <p className="text-center p-4 text-red-500">{error}</p>}

      {loading && (
        <p className="text-gray-500 text-center p-4">Cargando transacciones</p>
      )}

      {!loading && transactions.length === 0 && (
        <p className="text-center p-4">No hay transacciones disponibles</p>
      )}

      {transactions.map((transaction) => (
        <Transaction
          key={transaction.id}
          id={transaction.id}
          date={transaction.date}
          amount={transaction.amount}
          description={transaction.description}
          account={transaction.account}
        />
      ))}
    </ul>
  );
}
