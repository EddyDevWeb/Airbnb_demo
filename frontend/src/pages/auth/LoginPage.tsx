// src/pages/auth/LoginPage.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import type { LoginDto } from "../../types/user.types";
import type { AuthUser } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: LoginDto = { email, password };

    try {
      const res = await api.post("/users/login", payload);
      const data = res.data as {
        token: string;
        user: {
          id: string;
          name: string;
          email: string;
          role?: string | { name?: string };
        };
      };

      const role =
        typeof data.user.role === "string"
          ? data.user.role
          : data.user.role?.name || "client";

      const authUser: AuthUser = {
        token: data.token,
        user: {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role,
        },
      };

      login(authUser);
      toast.success("Bienvenido");
      navigate("/dashboard");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || "Credenciales incorrectas");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl w-96 shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
          Entrar
        </button>

        <p className="text-center mt-4">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-600">
            Crea una aquí
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-4">
          Proyecto de demostración. No introduzcas datos reales.
        </p>
      </form>
    </div>
  );
}
