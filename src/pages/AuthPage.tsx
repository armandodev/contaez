import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<boolean>(true);

  return (
    <main className="w-full min-h-screen grid place-items-center">
      <section
        className={`w-full grid gap-4 p-8 bg-white rounded-lg shadow-md ${
          authMode ? "max-w-md" : "max-w-screen-sm"
        }`}
      >
        {authMode ? <LoginForm /> : <RegisterForm />}
        <footer>
          {authMode && (
            <p className="text-center text-sm text-gray-500">
              ¿No tienes una cuenta?{" "}
              <button
                className="text-blue-500 hover:underline"
                onClick={() => setAuthMode(!authMode)}
              >
                Registrarse
              </button>
            </p>
          )}
          {!authMode && (
            <p className="text-center text-sm text-gray-500">
              Ya tienes una cuenta?{" "}
              <button
                className="text-blue-500 hover:underline"
                onClick={() => setAuthMode(!authMode)}
              >
                Iniciar sesión
              </button>
            </p>
          )}
        </footer>
      </section>
    </main>
  );
}
