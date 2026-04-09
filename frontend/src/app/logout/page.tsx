"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-slate-50">
      <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">
          Saindo do sistema...
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Encerrando sua sessão com segurança.
        </p>
      </div>
    </div>
  );
}
