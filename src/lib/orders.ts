export const fmtBRL = (v: number | null | undefined) => {
  const n = Number(v ?? 0);
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const fmtDate = (d: string | null | undefined) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("pt-BR");
  } catch {
    return "—";
  }
};

export const fmtDateTime = (d: string | null | undefined) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return "—";
  }
};

export const ORDER_STATUSES = [
  { value: "quote", label: "Orçamento", className: "bg-os-info/10 text-os-info" },
  { value: "authorized", label: "Aberta", className: "bg-primary/10 text-primary" },
  { value: "in_progress", label: "Em Andamento", className: "bg-os-warning/10 text-os-warning" },
  { value: "completed", label: "Finalizada", className: "bg-os-success/10 text-os-success" },
  { value: "lost", label: "Cancelada", className: "bg-destructive/10 text-destructive" },
] as const;

export type OrderStatusValue = typeof ORDER_STATUSES[number]["value"];

export const statusLabel = (s: string) =>
  ORDER_STATUSES.find((x) => x.value === s)?.label ?? s;

export const statusClass = (s: string) =>
  ORDER_STATUSES.find((x) => x.value === s)?.className ?? "bg-muted text-muted-foreground";

export const PAYMENT_METHODS = ["Dinheiro", "PIX", "Cartão Crédito", "Cartão Débito", "Fiado", "Outro"];

export const calcSubtotalService = (price: number, qty: number) =>
  Number(price) * Number(qty);

export const calcSubtotalProduct = (price: number, qty: number, discountPct: number) =>
  Number(price) * Number(qty) * (1 - Number(discountPct ?? 0) / 100);
