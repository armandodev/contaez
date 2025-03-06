// hooks/useTransactions.ts
import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import { useAuth } from "./useAuth";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  account: string;
  user_id: string;
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
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: false })
          .limit(limit);

        if (error) throw error;

        setTransactions(data || []);
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
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTransactions((prev) => [payload.new as Transaction, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setTransactions((prev) =>
              prev.filter((t) => t.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            setTransactions((prev) =>
              prev.map((t) =>
                t.id === payload.new.id ? (payload.new as Transaction) : t
              )
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
    transaction: Omit<Transaction, "id" | "user_id">
  ) => {
    if (!user) return { error: "Usuario no autenticado" };

    try {
      const { data, error } = await supabase
        .from("transaction")
        .insert([{ ...transaction, user_id: user.id }])
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (err: any) {
      return { error: err.message, data: null };
    }
  };

  return { transactions, loading, error, addTransaction };
}
