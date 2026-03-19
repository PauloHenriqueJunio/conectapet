import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-12 rounded-2xl border border-slate-200/70 bg-white/85 px-6 py-6 shadow-sm">
      <div className="flex items-center justify-center">
        <p className="text-center text-sm text-slate-600">
          © {new Date().getFullYear()} ConectaPet. Adoção responsável começa com
          informação.
        </p>
      </div>
    </footer>
  );
}
