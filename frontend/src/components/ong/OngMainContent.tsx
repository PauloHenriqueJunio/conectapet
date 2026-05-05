"use client";

import { ONG, ONG_CONSTANTS } from "@/lib/constants/ong.constants";
import { OngContactSection } from "./OngContactSection";
import { OngAboutSection } from "./OngAboutSection";
import { OngCtaSection } from "./OngCtaSection";

interface OngMainContentProps {
  ong: ONG;
  copiedPhone: boolean;
  onCopyPhone: (phone: string) => void;
  onScrollToPets: () => void;
}

export function OngMainContent({
  ong,
  copiedPhone,
  onCopyPhone,
  onScrollToPets,
}: OngMainContentProps) {
  return (
    <section className="bg-white py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:gap-12 grid-cols-1 lg:grid-cols-3">
          {/* LEFT COLUMN - INFO */}
          <div className="lg:col-span-2 space-y-8 md:space-y-12">
            <OngContactSection
              ong={ong}
              copiedPhone={copiedPhone}
              onCopyPhone={onCopyPhone}
            />
            <OngAboutSection ong={ong} />
          </div>

          {/* RIGHT COLUMN - CTA SIDEBAR */}
          <OngCtaSection onScrollToPets={onScrollToPets} />
        </div>
      </div>
    </section>
  );
}
