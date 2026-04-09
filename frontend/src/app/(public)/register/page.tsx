"use client";

import { Suspense } from "react";
import { RegisterForm } from "./components/RegisterForm";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Carregando...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
