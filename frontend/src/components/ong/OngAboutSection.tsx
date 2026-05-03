"use client";

import { ONG, ONG_CONSTANTS } from "@/lib/constants/ong.constants";

interface OngAboutSectionProps {
  ong: ONG;
}

export function OngAboutSection({ ong }: OngAboutSectionProps) {
  const aboutFirstParagraph = ONG_CONSTANTS.ABOUT.PARAGRAPHS.ONE.replace(
    "{{ONG_NAME}}",
    ong.name,
  );

  return (
    <div>
      <div className="mt-6 mb-6 flex items-center gap-2">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          {ONG_CONSTANTS.ABOUT.TITLE}
        </h2>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 md:p-8">
        <div className="space-y-4 text-slate-700 leading-relaxed">
          <p>{aboutFirstParagraph}</p>
          <p>{ONG_CONSTANTS.ABOUT.PARAGRAPHS.TWO}</p>
          <p>{ONG_CONSTANTS.ABOUT.PARAGRAPHS.THREE}</p>
        </div>

        {/* Volunteers team */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 ring-2 ring-white flex items-center justify-center text-white text-xs font-bold"
              >
                {i}
              </div>
            ))}
          </div>
          <p className="text-sm font-semibold text-slate-700">
            {ONG_CONSTANTS.ABOUT.VOLUNTEERS_LABEL}
          </p>
        </div>
      </div>
    </div>
  );
}
