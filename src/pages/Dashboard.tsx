import { TransactionsList } from "../components/ui";
import { useAuth } from "../hooks/";

export default function Dashboard() {
  const { signOut } = useAuth();

  return (
    <>
      <header className="bg-white rounded-md w-full mx-auto p-4 flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">ContaEZ</h1>
        <button
          onClick={signOut}
          className="px-4 py-2 bg-gray-100 text-gray-500 rounded-md cursor-pointer hover:bg-red-200 hover:text-red-500 transition-colors duration-200 ease-in-out"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="w-full grid gap-4">
        <TransactionsList />
      </main>
    </>
  );
}
