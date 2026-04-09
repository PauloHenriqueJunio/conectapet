import Link from "next/link";
import { Home, Search, ShieldAlert } from "lucide-react";
import { STATUS_COLORS } from "@/constants/theme";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.14),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(34,197,94,0.12),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(249,115,22,0.10),transparent_40%)]" />

      <section className="relative w-full max-w-2xl rounded-3xl border border-slate-200/70 bg-white/90 p-8 text-center shadow-2xl backdrop-blur sm:p-12">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: STATUS_COLORS.warning[100],
            color: STATUS_COLORS.warning[700],
          }}
        >
          <ShieldAlert className="h-8 w-8" />
        </div>

        <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-slate-500">
          Erro 404
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
          Essa página se perdeu no caminho
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
          A rota que você tentou acessar não existe no ConectaPet. Você pode
          voltar para a home ou procurar pets disponíveis para adoção.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            <Home className="h-4 w-4" />
            Voltar para o início
          </Link>

          <Link
            href="/home"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            <Search className="h-4 w-4" />
            Ver pets
          </Link>
        </div>
      </section>
    </main>
  );
}
