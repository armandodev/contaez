import Transaction from "./Transaction";
import { useTransactions } from "../../hooks/useTransactions";

export default function TransactionsList() {
  const { transactions, loading, error } = useTransactions();

  return (
    <ul className="grid bg-white w-full max-w-screen-sm mx-auto rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center my-4">Transacciones</h2>

      {loading && <p className="text-center p-4">Cargando transacciones...</p>}

      {error && <p className="text-center p-4 text-red-500">{error}</p>}

      {!loading && transactions.length === 0 && (
        <p className="text-center p-4">No hay transacciones disponibles</p>
      )}

      {transactions.map((transaction) => (
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
