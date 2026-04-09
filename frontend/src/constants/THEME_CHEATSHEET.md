# 🎨 Tema ConectaPet - Quick Reference

## ⚡ Uso Rápido

### Import

```tsx
import {
  BRAND_COLORS,
  COLOR_COMBINATIONS,
  getButtonClasses,
  getBadgeClasses,
  getInputClasses,
  combineClasses,
} from "@/constants/theme";
```

---

## Buttons

```tsx
// Primário (verde)
<button className={getButtonClasses("primary")}>Click</button>

// Secundário (outline)
<button className={getButtonClasses("secondary")}>Click</button>

// Perigo (vermelho)
<button className={getButtonClasses("danger")}>Delete</button>

// Manual
<button className={`${COLOR_COMBINATIONS.buttonPrimary.bg} ${COLOR_COMBINATIONS.buttonPrimary.text}`}>
  Custom
</button>
```

---

## Badges

```tsx
// Sucesso ✅
<span className={getBadgeClasses("success")}>Aprovado</span>

// Perigo ❌
<span className={getBadgeClasses("danger")}>Rejeitado</span>

// Aviso ⚠️
<span className={getBadgeClasses("warning")}>Pendente</span>

// Padrão
<span className={getBadgeClasses("default")}>Info</span>
```

---

## Inputs

```tsx
// Normal
<input className={getInputClasses()} />

// Com erro
<input className={getInputClasses(true)} />

// Manual
<input className={`${COLOR_COMBINATIONS.input.bg} ${COLOR_COMBINATIONS.input.border}`} />
```

---

## Cards

```tsx
// Base
<div className={`${COLOR_COMBINATIONS.card.bg} ${COLOR_COMBINATIONS.card.border}`}>
  Card content
</div>

// Com sombra
<div className={`${COLOR_COMBINATIONS.card.bg} ${COLOR_COMBINATIONS.card.border} ${COLOR_COMBINATIONS.card.shadow}`}>
  Card content
</div>
```

---

## Texto

```tsx
// Primário (H1, H2, etc)
<h1 className={COLOR_COMBINATIONS.text.primary}>Heading</h1>

// Secundário
<p className={COLOR_COMBINATIONS.text.secondary}>Subtitle</p>

// Terciário
<span className={COLOR_COMBINATIONS.text.tertiary}>Helper text</span>

// Mutado
<small className={COLOR_COMBINATIONS.text.muted}>Meta</small>

// Claro
<small className={COLOR_COMBINATIONS.text.light}>Very light</small>
```

---

## Links

```tsx
// Default (verde emerald)
<a href="#" className={COLOR_COMBINATIONS.link.default}>Link</a>

// Brand (verde brand)
<a href="#" className={COLOR_COMBINATIONS.link.brand}>Link</a>
```

---

## Cores Diretas

```tsx
// Verde (brand)
<div className="bg-brand-600 text-brand-800">Verde</div>
<div className="bg-brand-50">Fundo claro</div>

// Cinza
<div className="bg-slate-100 text-slate-700">Cinza</div>

// Status
<div className="bg-emerald-50 text-emerald-700">✅ Sucesso</div>
<div className="bg-red-50 text-red-700">❌ Erro</div>
<div className="bg-amber-50 text-amber-700">⚠️ Aviso</div>
```

---

## Combinações Prontas

```tsx
// Input com foco
${COLOR_COMBINATIONS.input.bg}
${COLOR_COMBINATIONS.input.border}
${COLOR_COMBINATIONS.input.focus}

// Button primário com hover
${COLOR_COMBINATIONS.buttonPrimary.bg}
${COLOR_COMBINATIONS.buttonPrimary.hover}
${COLOR_COMBINATIONS.buttonPrimary.focus}

// Card com border
${COLOR_COMBINATIONS.card.bg}
${COLOR_COMBINATIONS.card.border}
${COLOR_COMBINATIONS.card.shadow}
```

---

## Combinar Classes

```tsx
// Combina e filtra undefined
combineClasses("text-lg", isActive && "font-bold", "text-brand-800");
// Result: "text-lg font-bold text-brand-800"
```

---

## Constantes de Layout

```tsx
// Z-Index
${Z_INDEX.dropdown}     // z-50
${Z_INDEX.modal}        // z-50
${Z_INDEX.tooltip}      // z-40
${Z_INDEX.sticky}       // z-30

// Spacing
${SPACING.sm}           // 0.5rem
${SPACING.md}           // 1rem
${SPACING.lg}           // 1.5rem

// Shadows
${SHADOW_CLASSES.sm}    // shadow-sm
${SHADOW_CLASSES.lg}    // shadow-lg

// Radius
${BORDER_RADIUS.md}     // rounded-xl

// Transitions
${TRANSITIONS.fast}     // duration-200
${TRANSITIONS.normal}   // duration-300
```

---

## 🖼️ Base Components

```tsx
// Card base
<div className={CARD_BASE}>Content</div>

// Button base
<button className={BUTTON_BASE}>Click</button>

// Input base
<input className={INPUT_BASE} />

// Header base
<header className={HEADER_BASE}>Nav</header>
```

---

## 📋 Exemplo Completo

```tsx
import {
  COLOR_COMBINATIONS,
  getButtonClasses,
  getInputClasses,
  CARD_BASE,
  combineClasses,
} from "@/constants/theme";

export function MyForm() {
  const [email, setEmail] = useState("");

  return (
    <div className={combineClasses(CARD_BASE, "max-w-md")}>
      <h1 className={COLOR_COMBINATIONS.text.primary}>Login</h1>

      <input
        type="email"
        className={getInputClasses()}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className={getButtonClasses("primary")}>Entrar</button>

      <p className={COLOR_COMBINATIONS.text.tertiary}>
        Não tem conta?{" "}
        <a href="/register" className={COLOR_COMBINATIONS.link.brand}>
          Criar
        </a>
      </p>
    </div>
  );
}
```

---

## 🎯 Status Badges Avançado

```tsx
interface AdoptionStatus {
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export function StatusBadge({ status }: AdoptionStatus) {
  const variants = {
    PENDING: "warning",
    APPROVED: "success",
    REJECTED: "danger",
  } as const;

  return <span className={getBadgeClasses(variants[status])}>{status}</span>;
}
```

---

## 🔄 Responsive Classes

```tsx
// Combina com responsive prefixes
<div className={`${COLOR_COMBINATIONS.text.primary} md:text-lg lg:text-xl`}>
  Responsive text
</div>

// Completo
<div className={combineClasses(
  COLOR_COMBINATIONS.card.bg,
  "w-full md:w-1/2 lg:w-1/3",
  "shadow-sm md:shadow-md lg:shadow-lg"
)}>
  Responsive card
</div>
```

---

## ✅ Tabela de Cores

| Nome        | Hex     | Uso      |
| ----------- | ------- | -------- |
| brand-600   | #1f7f46 | Primário |
| brand-50    | #effbf3 | BG claro |
| slate-700   | #374151 | Texto    |
| slate-50    | #f9fafb | BG form  |
| emerald-600 | #16a34a | Sucesso  |
| red-700     | #b91c1c | Erro     |
| amber-700   | #b45309 | Aviso    |

---

## 🆘 Troubleshooting

**Classe não aparece?**
→ Verifique se importou corretamente

**Cor errada?**
→ Verifique `COLOR_MAP.md` para cor esperada

**Shadow missing?**
→ Use `shadow-sm`, `shadow-md`, etc

**Input não focável?**
→ Use `getInputClasses()` que já inclui focus styles

---

## 📚 More Info

- Guia completo: `THEME_GUIDE.md`
- Exemplos código: `THEME_EXAMPLES.tsx`
- Mapa de cores: `COLOR_MAP.md`
- Arquivo principal: `src/constants/theme.ts`

---

**Salve este arquivo como favorito! 🌟**
