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
import { AuthResponse, AuthUser, AuthUserFull, Role } from "@/types/api";

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
  deleteAccount: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const PRIVATE_PREFIXES = ["/ong", "/pessoa-fisica"];
const COOKIE_SESSION_FLAG = "cookie-session";

function isRoutePrivate(pathname: string) {
  return PRIVATE_PREFIXES.some(
    (privatePrefix) =>
      pathname === privatePrefix || pathname.startsWith(`${privatePrefix}/`),
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const profile = await apiFetch<AuthUser>("/auth/profile");

        if (!isMounted) {
          return;
        }

        setUser(profile);
        setToken(COOKIE_SESSION_FLAG);
      } catch {
        if (!isMounted) {
          return;
        }

        setToken(null);
        setUser(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!token && isRoutePrivate(pathname)) {
      router.replace("/login");
      return;
    }

    if (token && user && (pathname === "/login" || pathname === "/register")) {
      if (user.role === "ONG") {
        router.replace("/ong/dashboard");
      } else {
        router.replace("/pessoa-fisica/home");
      }
    }
  }, [pathname, token, isLoading, router]);

  const persistSession = async (auth: AuthResponse) => {
    setToken(COOKIE_SESSION_FLAG);
    setUser(auth.user);

    try {
      const fullProfile = await apiFetch<AuthUserFull>("/auth/profile");
      if (fullProfile) {
        setUser(fullProfile);
      }
    } catch {
      // Keep user with public data if profile fetch fails
    }
  };

  const login = async (payload: LoginPayload, expectedRole?: Role) => {
    const auth = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (expectedRole && auth.user.role !== expectedRole) {
      throw new Error("ROLE_MISMATCH");
    }

    await persistSession(auth);
    if (auth.user.role === "ONG") {
      router.push("/ong/dashboard");
    } else {
      router.push("/pessoa-fisica/home");
    }
  };

  const register = async (payload: RegisterPayload) => {
    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    await login(
      { email: payload.email, password: payload.password },
      payload.role,
    );
  };

  const logout = () => {
    void apiFetch("/auth/logout", {
      method: "POST",
    }).catch(() => {
      // Keep client-side logout resilient even if API call fails.
    });

    setToken(null);
    setUser(null);
    router.push("/login");
  };

  const deleteAccount = async (password: string) => {
    await apiFetch("/auth/account", {
      method: "DELETE",
      body: JSON.stringify({ password }),
    });

    setToken(null);
    setUser(null);
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
      deleteAccount,
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
