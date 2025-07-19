// src/context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuth: boolean;
  loading: boolean; // Propriedade adicionada
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, [mounted]);

  const login = (newToken: string) => {
    setToken(newToken);
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", newToken);
    }
  };

  const logout = () => {
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("cartId"); // Limpa o ID do carrinho ao deslogar
    }
  };

  // Previne hydration mismatch mostrando um loading durante a hidratação
  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isAuth: !!token, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
