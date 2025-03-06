import { useState } from "react";
import { useAuth } from "../../hooks/";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <h2 className="text-center text-2xl font-bold">Iniciar sesión</h2>

      {error && (
        <p className="p-2 text-red-500 bg-red-200 border-2 border-red-500 rounded-md">
          {error}
        </p>
      )}

      <label className="grid gap-2 items-center">
        Correo electrónico
        <input
          className="w-full p-2 border rounded"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="grid gap-2 items-center">
        Contraseña
        <input
          className="w-full p-2 border rounded"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className={`w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 ease-in-out ${
          loading ? "cursor-default opacity-50" : "cursor-pointer"
        }`}
      >
        Iniciar sesión
      </button>
    </form>
  );
}
