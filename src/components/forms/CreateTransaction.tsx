import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../config/supabase";

// Interfaz para cuentas
interface Account {
  id: number;
  code: string;
  name: string;
}

export default function CreateTransaction() {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const { user } = useAuth();

  // Cargar cuentas al montar el componente
  useState(() => {
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
  }, []);

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
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h3 className="text-xl font-bold mb-4">Crear nueva transacción</h3>

      {message && (
        <div
          className={`p-3 mb-4 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="description" className="block mb-1 font-medium">
          Descripción
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="date" className="block mb-1 font-medium">
          Fecha
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="amount" className="block mb-1 font-medium">
          Monto (positivo para ingreso, negativo para gasto)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="account" className="block mb-1 font-medium">
          Cuenta
        </label>
        <select
          id="account"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Seleccionar cuenta</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.code} - {account.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar transacción"}
      </button>
    </form>
  );
}
