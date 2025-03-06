import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <div className="flex border-b">
            <button
              className={`py-2 px-4 ${
                authMode === "login" ? "border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setAuthMode("login")}
            >
              Iniciar sesión
            </button>
            <button
              className={`py-2 px-4 ${
                authMode === "register" ? "border-b-2 border-blue-500" : ""
              }`}
              onClick={() => setAuthMode("register")}
            >
              Registrarse
            </button>
          </div>
        </div>

        {authMode === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
