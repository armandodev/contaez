import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import { useAuth } from "../hooks/"; // Cambiado a importar desde context

export interface Transaction {
  id: string;
  date: string;
  description: string;
  account: string; // Añadido para alinearse con el componente Transaction
  amount: number; // Calculado desde debit y credit
  user_id: string;
  // Propiedades internas de la DB
  debit?: number;
  credit?: number;
  account_id?: number;
}

export function useTransactions(limit = 10) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Cargar transacciones iniciales
    const fetchTransactions = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("transaction")
          .select(
            `
            *,
            account:account_id (name)
          `
          )
          .eq("user_id", user.id)
          .order("date", { ascending: false })
          .limit(limit);

        if (error) throw error;

        // Transformar los datos para que coincidan con la interfaz Transaction
        const transformedData = (data || []).map((item) => ({
          id: item.id,
          date: item.date,
          description: item.description,
          account: item.account ? item.account.name : "Desconocida",
          amount: (item.debit || 0) - (item.credit || 0), // Positivo para débito, negativo para crédito
          user_id: item.user_id,
          debit: item.debit,
          credit: item.credit,
          account_id: item.account_id,
        }));

        setTransactions(transformedData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transaction",
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          // Para obtener el nombre de la cuenta necesitamos hacer una consulta adicional
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            try {
              const { data } = await supabase
                .from("account")
                .select("name")
                .eq("id", payload.new.account_id)
                .single();

              const accountName = data ? data.name : "Desconocida";

              const newTransaction = {
                ...payload.new,
                account: accountName,
                amount: (payload.new.debit || 0) - (payload.new.credit || 0),
              } as Transaction;

              if (payload.eventType === "INSERT") {
                setTransactions((prev) => [newTransaction, ...prev]);
              } else if (payload.eventType === "UPDATE") {
                setTransactions((prev) =>
                  prev.map((t) =>
                    t.id === payload.new.id ? newTransaction : t
                  )
                );
              }
            } catch (err) {
              console.error("Error al obtener cuenta:", err);
            }
          } else if (payload.eventType === "DELETE") {
            setTransactions((prev) =>
              prev.filter((t) => t.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, limit]);

  // Función para agregar una nueva transacción
  const addTransaction = async (
    transaction: Omit<Transaction, "id" | "user_id" | "account">
  ) => {
    if (!user) return { error: "Usuario no autenticado" };

    try {
      const { data, error } = await supabase
        .from("transaction")
        .insert([
          {
            ...transaction,
            user_id: user.id,
            // Transformación de amount a debit/credit
            debit: transaction.amount > 0 ? transaction.amount : 0,
            credit: transaction.amount < 0 ? Math.abs(transaction.amount) : 0,
          },
        ])
        .single();

      if (error) throw error;

      return { data, error: null };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return { error: err.message, data: null };
    }
  };

  return { transactions, loading, error, addTransaction };
}
