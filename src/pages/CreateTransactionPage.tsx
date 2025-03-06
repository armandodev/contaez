import { Link } from "react-router-dom";
import { CreateTransactionForm } from "../components/forms/";

export default function CreateTransactionPage() {
  return (
    <main className="w-full min-h-screen grid place-items-center">
      <CreateTransactionForm />

      <Link
        to="/"
        className="absolute top-4 left-4 hover:bg-gray-500 hover:text-white rounded-md px-4 py-2 bg-gray-300 text-gray-500 transition-colors duration-200 ease-in-out"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
