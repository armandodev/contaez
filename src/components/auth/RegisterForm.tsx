import { useState } from "react";
import { useAuth } from "../../hooks/";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password);
      if (error) throw error;

      setMessage(
        "Registro exitoso. Revisa tu correo para confirmar tu cuenta."
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      setError("Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-center text-2xl font-bold">Registro</h2>

      {error && (
        <p className="p-2 text-red-500 bg-red-200 border-2 border-red-500 rounded-md">
          {error}
        </p>
      )}
      {message && (
        <p className="p-2 text-green-500 bg-green-200 border-2 border-green-500 rounded-md">
          {message}
        </p>
      )}

      <label className="grid gap-2 items-center">
        Correo electrónico
        <input
          className="w-full p-2 border rounded"
          type="email"
          id="register-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="grid gap-2 items-center">
          Contraseña
          <input
            className="w-full p-2 border rounded"
            type="password"
            id="register-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label className="grid gap-2 items-center">
          Confirmar contraseña
          <input
            className="w-full p-2 border rounded"
            type="password"
            id="register-confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 ease-in-out ${
          loading ? "cursor-default opacity-50" : "cursor-pointer"
        }`}
      >
        Registrarse
      </button>
    </form>
  );
}
