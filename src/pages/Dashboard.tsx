import { useAuth } from "../hooks/";
import { TransactionsList } from "../components/ui";
import CreateTransaction from "../components/forms/CreateTransaction";

export default function Dashboard() {
  const { signOut, user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Financiero</h1>
        <div className="flex items-center gap-4">
          <span>{user?.email}</span>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="space-y-8">
        <TransactionsList />
        <CreateTransaction />
      </div>
    </div>
  );
}
