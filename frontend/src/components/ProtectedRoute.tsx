// src/components/ProtectedRoute.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // A lógica no AuthProvider garante que este useEffect só rode
    // após a verificação inicial do token no localStorage.
    if (!isAuth) {
      router.push("/login");
    }
  }, [isAuth, router]);

  // Se estiver autenticado, renderiza o conteúdo da rota.
  // Caso contrário, mostra uma mensagem enquanto o redirecionamento acontece.
  return isAuth ? <>{children}</> : <p className="p-10">Redirecionando...</p>;
}
