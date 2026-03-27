"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { AuthResponse, AuthUser, Role } from "@/types/api";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  cep: string;
  contact?: string;
  address?: string;
  cpf?: string;
  cnpj?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload, expectedRole?: Role) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const PUBLIC_PATHS = ["/", "/login", "/register", "/quem-somos", "/ongs"];
const STORAGE_KEY = "conectapet_auth";

function isRoutePublic(pathname: string) {
  return PUBLIC_PATHS.some(
    (publicPath) =>
      pathname === publicPath || pathname.startsWith(`${publicPath}/`),
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { token: string; user: AuthUser };
        setToken(parsed.token);
        setUser(parsed.user);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const isPublicPath = isRoutePublic(pathname);

    if (!token && !isPublicPath) {
      router.replace("/login");
      return;
    }

    if (token && (pathname === "/login" || pathname === "/register")) {
      router.replace("/ong/dashboard");
    }
  }, [pathname, token, isLoading, router]);

  const persistSession = (auth: AuthResponse) => {
    setToken(auth.accessToken);
    setUser(auth.user);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: auth.accessToken, user: auth.user }),
    );
  };

  const login = async (payload: LoginPayload, expectedRole?: Role) => {
    const auth = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (expectedRole && auth.user.role !== expectedRole) {
      throw new Error("ROLE_MISMATCH");
    }

    persistSession(auth);
    router.push("/ong/dashboard");
  };

  const register = async (payload: RegisterPayload) => {
    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    await login({ email: payload.email, password: payload.password });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    router.push("/login");
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      register,
      logout,
    }),
    [token, user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
