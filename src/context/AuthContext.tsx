import { createContext } from "react";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (
    email: string,
    password: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<{ error: any | null; user: User | null }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);
