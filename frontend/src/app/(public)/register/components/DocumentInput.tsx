import { Role } from "@/types/api";

interface DocumentInputProps {
  role: Role;
  cpf: string;
  cnpj: string;
  onCpfChange: (value: string) => void;
  onCnpjChange: (value: string) => void;
}

export function DocumentInput({
  role,
  cpf,
  cnpj,
  onCpfChange,
  onCnpjChange,
}: DocumentInputProps) {
  if (role === "PESSOA_FISICA") {
    return (
      <>
        <label htmlFor="cpf" className="mb-1 block text-sm font-medium">
          CPF (opcional)
        </label>
        <input
          id="cpf"
          type="text"
          value={cpf}
          onChange={(e) => onCpfChange(e.target.value)}
          placeholder="000.000.000-00"
          className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
        />
      </>
    );
  }

  return (
    <>
      <label htmlFor="cnpj" className="mb-1 block text-sm font-medium">
        CNPJ (obrigatório)
      </label>
      <input
        id="cnpj"
        type="text"
        required
        value={cnpj}
        onChange={(e) => onCnpjChange(e.target.value)}
        placeholder="00.000.000/0000-00"
        className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
      />
    </>
  );
}
