import Link from "next/link";
import { Building2 } from "lucide-react";
import { ONG_CONSTANTS } from "@/lib/constants/ong.constants";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function LoadingState() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader page="ongs" variant="public" />
      <main className="flex flex-1 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function ErrorState({ error }: { error: string | null }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader page="ongs" variant="public" />
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <Building2 size={48} className="mb-4 text-slate-300" />
        <h1 className="text-2xl font-bold text-slate-900">
          {ONG_CONSTANTS.ERRORS.NOT_FOUND_TITLE}
        </h1>
        <p className="mt-2 text-slate-600">
          {error || ONG_CONSTANTS.ERRORS.NOT_FOUND_MESSAGE}
        </p>
        <Link
          href="/ongs"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
        >
          {ONG_CONSTANTS.ERRORS.BACK_TO_ONGS}
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
