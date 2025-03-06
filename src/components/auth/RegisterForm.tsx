import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

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
    } catch (error: any) {
      setError(error.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Registrarse</h2>

      {error && <div className="p-2 text-red-500">{error}</div>}
      {message && <div className="p-2 text-green-500">{message}</div>}

      <div>
        <label htmlFor="register-email" className="block mb-1">
          Correo electrónico
        </label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="register-password" className="block mb-1">
          Contraseña
        </label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="confirm-password" className="block mb-1">
          Confirmar contraseña
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full p-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Cargando..." : "Registrarse"}
      </button>
    </form>
  );
}
