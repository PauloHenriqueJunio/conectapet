import { Role } from "@/types/api";

interface RoleSelectorProps {
  role: Role;
  onRoleChange: (role: Role) => void;
}

export function RoleSelector({ role, onRoleChange }: RoleSelectorProps) {
  return (
    <nav className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
      <button
        type="button"
        onClick={() => onRoleChange("PESSOA_FISICA")}
        className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${role === "PESSOA_FISICA" ? "bg-white text-brand-700 shadow-sm" : "text-slate-600 hover:text-slate-800"}`}
      >
        Pessoa Física
      </button>
      <button
        type="button"
        onClick={() => onRoleChange("ONG")}
        className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${role === "ONG" ? "bg-white text-brand-700 shadow-sm" : "text-slate-600 hover:text-slate-800"}`}
      >
        ONG
      </button>
    </nav>
  );
}
