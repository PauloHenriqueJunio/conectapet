import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-12 rounded-2xl border border-slate-200/70 bg-white/85 px-6 py-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          © {new Date().getFullYear()} ConectaPet. Adoção responsável começa com
          informação.
        </p>

        <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
          <Link href="/" className="transition hover:text-brand-700">
            Home
          </Link>
          <Link href="/ongs" className="transition hover:text-brand-700">
            ONGs
          </Link>
          <Link href="/quem-somos" className="transition hover:text-brand-700">
            Quem somos
          </Link>
        </div>
      </div>
    </footer>
  );
}
