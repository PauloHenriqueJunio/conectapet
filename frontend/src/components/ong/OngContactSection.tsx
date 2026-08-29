"use client";

import { Phone, MapPin, Mail } from "lucide-react";
import { ONG, ONG_CONSTANTS } from "@/lib/constants/ong.constants";

interface OngContactSectionProps {
  ong: ONG;
  copiedPhone: boolean;
  onCopyPhone: (phone: string) => void;
}

export function OngContactSection({
  ong,
  copiedPhone,
  onCopyPhone,
}: OngContactSectionProps) {
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          {ONG_CONSTANTS.CONTACT.TITLE}
        </h2>
      </div>
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-slate-500">
        {ONG_CONSTANTS.CONTACT.DESCRIPTION}
      </p>

      <div className="grid gap-4">
        {/* Phone Card */}
        {ong.contact && (
          <div className="rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 p-6 transition hover:shadow-lg dark:from-[var(--status-success-bg)] dark:via-[var(--bg-card)] dark:to-[var(--status-success-bg)]">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-100 shadow-sm">
                <Phone size={28} className="text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {ONG_CONSTANTS.CONTACT.PHONE.LABEL}
                </p>
                <p className="text-xl font-bold text-slate-900 mb-4 break-all">
                  {ong.contact}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <a
                    href={`tel:${ong.contact.replace(/\D/g, "")}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-semibold transition"
                  >
                    {ONG_CONSTANTS.CONTACT.PHONE.CALL_BTN}
                  </a>
                  <button
                    type="button"
                    onClick={() => onCopyPhone(ong.contact!)}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-700 px-4 py-2 text-sm font-semibold transition"
                  >
                    {copiedPhone
                      ? ONG_CONSTANTS.CONTACT.PHONE.COPIED
                      : ONG_CONSTANTS.CONTACT.PHONE.COPY_BTN}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location Card */}
        {ong.city && ong.state && (
          <div className="rounded-3xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-white to-blue-50/40 p-6 transition hover:shadow-lg dark:from-[var(--status-info-bg)] dark:via-[var(--bg-card)] dark:to-[var(--status-info-bg)]">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 shadow-sm">
                <MapPin size={28} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {ONG_CONSTANTS.CONTACT.LOCATION.LABEL}
                </p>
                <p className="text-lg font-bold text-slate-900 mb-4">
                  {ong.city}, {ong.state}
                </p>
                <a
                  href={`https://maps.google.com/?q=${ong.city},${ong.state}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold transition"
                >
                  {ONG_CONSTANTS.CONTACT.LOCATION.VIEW_MAPS}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Email Card */}
        {ong.email && (
          <div className="rounded-3xl border border-purple-200/70 bg-gradient-to-br from-purple-50 via-white to-purple-50/40 p-6 transition hover:shadow-lg dark:from-[var(--status-purple-bg)] dark:via-[var(--bg-card)] dark:to-[var(--status-purple-bg)]">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-purple-100 shadow-sm">
                <Mail size={28} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {ONG_CONSTANTS.CONTACT.EMAIL.LABEL}
                </p>
                <p className="text-lg font-bold text-slate-900 mb-4 break-all">
                  {ong.email}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <a
                    href={`mailto:${ong.email}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm font-semibold transition"
                  >
                    {ONG_CONSTANTS.CONTACT.EMAIL.SEND_BTN}
                  </a>
                  <button
                    onClick={() => handleCopyEmail(ong.email!)}
                    className="inline-flex items-center gap-2 rounded-xl border border-purple-300 bg-white hover:bg-purple-50 text-purple-700 px-4 py-2 text-sm font-semibold transition"
                  >
                    {ONG_CONSTANTS.CONTACT.EMAIL.COPY_BTN}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
