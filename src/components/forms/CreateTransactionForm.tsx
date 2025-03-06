import { useState, useEffect } from "react";
import { useAuth } from "../../hooks";
import { supabase } from "../../config/supabase";

// Interfaz para cuentas
interface Account {
  id: number;
  code: string;
  name: string;
}

export default function CreateTransactionForm() {
  const [description, setDescription] = useState("");
  const actualDate = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(actualDate);
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const { user } = useAuth();

  // Corregido: useEffect en lugar de useState
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data, error } = await supabase
          .from("account")
          .select("id, code, name")
          .eq("active", true)
          .order("code");

        if (error) throw error;
        setAccounts(data || []);
      } catch (error) {
        console.error("Error al cargar cuentas:", error);
      }
    };

    fetchAccounts();
  }, []); // Array de dependencias vacío para ejecutar solo una vez

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage(null);

    try {
      // Determinar si es débito o crédito basado en el monto
      const amountValue = parseFloat(amount);
      const debit = amountValue > 0 ? amountValue : 0;
      const credit = amountValue < 0 ? Math.abs(amountValue) : 0;

      const { error } = await supabase.from("transaction").insert([
        {
          date,
          account_id: parseInt(accountId),
          description,
          debit,
          credit,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      // Limpiar formulario después de envío exitoso
      setDescription("");
      setDate("");
      setAmount("");
      setAccountId("");

      setMessage({
        text: "Transacción creada exitosamente",
        type: "success",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage({
        text: error.message || "Error al crear la transacción",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 w-[90%] p-8 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-center text-2xl font-bold">Nueva transacción</h2>

      {message && message.type === "success" && (
        <p className="p-2 text-green-500 bg-green-200 border-2 border-green-500 rounded-md">
          {message.text}
        </p>
      )}
      {message && message.type !== "success" && (
        <p className="p-2 text-red-500 bg-red-200 border-2 border-red-500 rounded-md">
          {message.text}
        </p>
      )}

      <label className="grid gap-4 items-center">
        Descripción
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </label>
      <label className="grid gap-4 items-center">
        Fecha
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="grid gap-4 items-center">
          Monto
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            placeholder="+ Ingreso, - Gasto"
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <label className="grid gap-4 items-center">
          Cuenta
          <select
            className="w-full p-2 border rounded"
            id="account"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            required
          >
            <option value="">Seleccionar cuenta</option>
            {accounts.map((account) => (
              <option
                className="w-full p-2 border rounded"
                key={account.id}
                value={account.id}
              >
                {account.code} - {account.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 ease-in-out ${
          loading ? "cursor-default opacity-50" : "cursor-pointer"
        }`}
      >
        Crear transacción
      </button>
    </form>
  );
}
