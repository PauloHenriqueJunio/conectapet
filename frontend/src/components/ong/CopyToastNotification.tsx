import { ONG_CONSTANTS } from "@/lib/constants/ong.constants";

export function CopyToastNotification({
  visible,
  exiting,
}: {
  visible: boolean;
  exiting: boolean;
}) {
  if (!visible) return null;

  return (
    <div
      className={`fixed left-1/2 top-28 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-3xl border border-emerald-200 bg-white px-6 py-4 text-center shadow-2xl shadow-emerald-100/60 transition-opacity duration-300 ease-out ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <p className="text-base font-bold text-emerald-700">
        {ONG_CONSTANTS.TOAST.PHONE_COPIED}
      </p>
    </div>
  );
}
