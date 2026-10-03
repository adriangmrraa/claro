import Link from "next/link";

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 font-heading font-bold text-white shadow-sm"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
      aria-hidden
    >
      C
    </span>
  );
}

export function Wordmark({ size = "md", href }: { size?: "sm" | "md" | "lg"; href?: string }) {
  const cls = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-3xl",
  }[size];
  const mark = { sm: 22, md: 28, lg: 40 }[size];
  const inner = (
    <span className="inline-flex items-center gap-2">
      <LogoMark size={mark} />
      <span className={`font-heading font-bold tracking-tight ${cls}`}>CLARO</span>
    </span>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
