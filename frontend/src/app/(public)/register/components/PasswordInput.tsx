import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
}

export function PasswordInput({
  value,
  onChange,
  showPassword,
  onToggleShowPassword,
}: PasswordInputProps) {
  return (
    <div>
      <label htmlFor="password" className="mb-1 block text-sm font-medium">
        Senha
      </label>
      <div className="relative">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          required
          minLength={6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-300 py-2 pl-4 pr-10 outline-none ring-brand-300 focus:ring"
        />
        <button
          type="button"
          onClick={onToggleShowPassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
