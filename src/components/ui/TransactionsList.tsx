import Transaction from "./Transaction";

export default function TransactionsList() {
  return (
    <ul className="grid bg-white w-full max-w-screen-sm mx-auto rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-center my-4">Transacciones</h2>
      <Transaction
        date="2023-01-01"
        amount={1000}
        description="Ingreso"
        account="Banco"
      />
    </ul>
  );
}
