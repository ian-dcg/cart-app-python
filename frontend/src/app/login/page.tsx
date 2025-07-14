// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/lib/api";
import Link from "next/link"; // Importar o Link para navegação

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // O endpoint de token do FastAPI espera dados de formulário
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const data = await loginUser(formData);

      if (data.access_token) {
        login(data.access_token);
        router.push("/products"); // Redireciona para produtos após o login
      }
    } catch (err: any) {
      setError(err.message || "Falha no login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Login</h1>
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-600 text-sm font-medium mb-2"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            Entrar
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-8">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Cadastrar-se
          </Link>
        </p>
      </div>
    </div>
  );
}
